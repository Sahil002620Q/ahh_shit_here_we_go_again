from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class UserRole(str, enum.Enum):
    SELLER = "seller"
    BUYER = "buyer"
    ADMIN = "admin"

class ListingStatus(str, enum.Enum):
    ACTIVE = "active"
    SOLD = "sold"
    EXPIRED = "expired"

class BuyRequestStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email_or_phone = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.BUYER)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    listings = relationship("Listing", back_populates="seller", foreign_keys="Listing.seller_id")
    buy_requests = relationship("BuyRequest", back_populates="buyer", foreign_keys="BuyRequest.buyer_id")

class Listing(Base):
    __tablename__ = "listings"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False, index=True)
    brand = Column(String, index=True)
    model = Column(String, index=True)
    condition = Column(String, nullable=False)
    working_parts = Column(Text)
    price = Column(Float, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text)
    photos = Column(JSON, default=list)
    status = Column(Enum(ListingStatus), default=ListingStatus.ACTIVE, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    seller = relationship("User", back_populates="listings", foreign_keys=[seller_id])
    buy_requests = relationship("BuyRequest", back_populates="listing")

class BuyRequest(Base):
    __tablename__ = "buy_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(BuyRequestStatus), default=BuyRequestStatus.PENDING)
    commission_status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    listing = relationship("Listing", back_populates="buy_requests")
    buyer = relationship("User", back_populates="buy_requests", foreign_keys=[buyer_id])
