from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta

from database import engine, get_db
from models import Base, User, Listing, BuyRequest, UserRole, ListingStatus, BuyRequestStatus
from schemas import (
    UserCreate, UserLogin, UserResponse, Token,
    ListingCreate, ListingUpdate, ListingResponse,
    BuyRequestCreate, BuyRequestUpdate, BuyRequestResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, require_role
)
from config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Electronic Parts Marketplace API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth endpoints
@app.post("/api/auth/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email_or_phone == user.email_or_phone).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email or phone already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name=user.name,
        email_or_phone=user.email_or_phone,
        hashed_password=hashed_password,
        role=user.role,
        location=user.location
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(
        data={"sub": str(new_user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}

@app.post("/api/auth/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email_or_phone == user.email_or_phone).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    access_token = create_access_token(
        data={"sub": str(db_user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Listing endpoints
@app.post("/api/listings", response_model=ListingResponse)
def create_listing(
    listing: ListingCreate,
    current_user: User = Depends(require_role([UserRole.SELLER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    new_listing = Listing(**listing.dict(), seller_id=current_user.id)
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing

@app.get("/api/listings", response_model=List[ListingResponse])
def get_listings(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    model: Optional[str] = None,
    condition: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    location: Optional[str] = None,
    status: ListingStatus = ListingStatus.ACTIVE,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Listing).filter(Listing.status == status)
    
    if category:
        query = query.filter(Listing.category.ilike(f"%{category}%"))
    if brand:
        query = query.filter(Listing.brand.ilike(f"%{brand}%"))
    if model:
        query = query.filter(Listing.model.ilike(f"%{model}%"))
    if condition:
        query = query.filter(Listing.condition.ilike(f"%{condition}%"))
    if min_price:
        query = query.filter(Listing.price >= min_price)
    if max_price:
        query = query.filter(Listing.price <= max_price)
    if location:
        query = query.filter(Listing.location.ilike(f"%{location}%"))
    
    return query.offset(skip).limit(limit).all()

@app.get("/api/listings/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@app.put("/api/listings/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_update: ListingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing.seller_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    for key, value in listing_update.dict(exclude_unset=True).items():
        setattr(listing, key, value)
    
    db.commit()
    db.refresh(listing)
    return listing

@app.delete("/api/listings/{listing_id}")
def delete_listing(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing.seller_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(listing)
    db.commit()
    return {"message": "Listing deleted"}

@app.get("/api/my-listings", response_model=List[ListingResponse])
def get_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Listing).filter(Listing.seller_id == current_user.id).all()

# Buy Request endpoints
@app.post("/api/buy-requests", response_model=BuyRequestResponse)
def create_buy_request(
    request: BuyRequestCreate,
    current_user: User = Depends(require_role([UserRole.BUYER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == request.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing.status != ListingStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Listing is not active")
    
    new_request = BuyRequest(
        listing_id=request.listing_id,
        buyer_id=current_user.id,
        seller_id=listing.seller_id
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@app.get("/api/buy-requests", response_model=List[BuyRequestResponse])
def get_buy_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.ADMIN:
        return db.query(BuyRequest).all()
    elif current_user.role == UserRole.SELLER:
        return db.query(BuyRequest).filter(BuyRequest.seller_id == current_user.id).all()
    else:
        return db.query(BuyRequest).filter(BuyRequest.buyer_id == current_user.id).all()

@app.put("/api/buy-requests/{request_id}", response_model=BuyRequestResponse)
def update_buy_request(
    request_id: int,
    request_update: BuyRequestUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    buy_request = db.query(BuyRequest).filter(BuyRequest.id == request_id).first()
    if not buy_request:
        raise HTTPException(status_code=404, detail="Buy request not found")
    
    if buy_request.seller_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    for key, value in request_update.dict(exclude_unset=True).items():
        setattr(buy_request, key, value)
    
    db.commit()
    db.refresh(buy_request)
    return buy_request

# Admin endpoints
@app.get("/api/admin/stats")
def get_admin_stats(
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    total_listings = db.query(Listing).count()
    active_listings = db.query(Listing).filter(Listing.status == ListingStatus.ACTIVE).count()
    total_requests = db.query(BuyRequest).count()
    pending_commissions = db.query(BuyRequest).filter(
        BuyRequest.status == BuyRequestStatus.COMPLETED,
        BuyRequest.commission_status == "pending"
    ).count()
    
    return {
        "total_listings": total_listings,
        "active_listings": active_listings,
        "total_requests": total_requests,
        "pending_commissions": pending_commissions
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
