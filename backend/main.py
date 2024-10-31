from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import List
from datetime import datetime

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./shop.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI instance
app = FastAPI()

# CORS configuration (optional, remove if not needed)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database model
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    status = Column(String)
    imageUrl = Column(String)
    note = Column(String)
    date = Column(DateTime) 

Base.metadata.create_all(bind=engine)

# Pydantic models
class ProductBase(BaseModel):
    company: str
    status: str
    imageUrl: str
    note: str
    date: datetime  

class ProductResponse(ProductBase):
    id: int

# Create Product
@app.post("/products/", response_model=ProductResponse)
def create_product(product: ProductBase):
    db = SessionLocal()
    try:
        db_product = Product(**product.dict())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
    finally:
        db.close()
    return db_product

# Read all Products
@app.get("/products/", response_model=List[ProductResponse])
def read_products():
    db = SessionLocal()
    try:
        products = db.query(Product).all()
    finally:
        db.close()
    return products

# Read Product by ID
@app.get("/products/{product_id}", response_model=ProductResponse)
def read_product(product_id: int):
    db = SessionLocal()
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if product is None:
            raise HTTPException(status_code=404, detail="Product not found")
    finally:
        db.close()
    return product

# Update Product
@app.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductBase):
    db = SessionLocal()
    try:
        db_product = db.query(Product).filter(Product.id == product_id).first()
        if db_product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        for key, value in product.dict().items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    finally:
        db.close()
    return db_product

# Delete Product
@app.delete("/products/{product_id}", response_model=dict)
def delete_product(product_id: int):
    db = SessionLocal()
    try:
        db_product = db.query(Product).filter(Product.id == product_id).first()
        if db_product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        db.delete(db_product)
        db.commit()
    finally:
        db.close()
    return {"ok": True}

# Root endpoint for testing
@app.get("/")
def read_root():
    return {"message": "Welcome to the Product API"}
