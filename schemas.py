from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    stock: int
    description: Optional[str] = ""

class Product(ProductCreate):
    id: int
    class Config:
        from_attributes = True

class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    address: Optional[str] = ""

class Customer(CustomerCreate):
    id: int
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    product_id: int
    customer_id: int
    quantity: int

class Order(BaseModel):
    id: int
    product_id: int
    customer_id: int
    quantity: int
    total_price: float
    status: str
    created_at: datetime
    product: Optional[Product] = None
    customer: Optional[Customer] = None
    class Config:
        from_attributes = True
