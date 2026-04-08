from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole, ListingStatus, BuyRequestStatus

class UserCreate(BaseModel):
    name: str
    email_or_phone: str
    password: str
    role: UserRole = UserRole.BUYER
    location: Optional[str] = None

class UserLogin(BaseModel):
    email_or_phone: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email_or_phone: str
    role: UserRole
    location: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ListingCreate(BaseModel):
    category: str
    brand: Optional[str] = None
    model: Optional[str] = None
    condition: str
    working_parts: Optional[str] = None
    price: float
    location: str
    description: Optional[str] = None
    photos: List[str] = []

class ListingUpdate(BaseModel):
    category: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    condition: Optional[str] = None
    working_parts: Optional[str] = None
    price: Optional[float] = None
    location: Optional[str] = None
    description: Optional[str] = None
    photos: Optional[List[str]] = None
    status: Optional[ListingStatus] = None

class ListingResponse(BaseModel):
    id: int
    seller_id: int
    category: str
    brand: Optional[str]
    model: Optional[str]
    condition: str
    working_parts: Optional[str]
    price: float
    location: str
    description: Optional[str]
    photos: List[str]
    status: ListingStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class BuyRequestCreate(BaseModel):
    listing_id: int

class BuyRequestUpdate(BaseModel):
    status: BuyRequestStatus
    commission_status: Optional[str] = None

class BuyRequestResponse(BaseModel):
    id: int
    listing_id: int
    buyer_id: int
    seller_id: int
    status: BuyRequestStatus
    commission_status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
