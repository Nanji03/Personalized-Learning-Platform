#User management routes for FastAPI application
#This module handles user registration and login functionality.
from fastapi import APIRouter, HTTPException, Depends, Form
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

router = APIRouter(prefix="/users", tags=["users"])

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

def get_database():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["your_database_name"]
    return db

@router.post("/register")
async def register_user(user: UserCreate, db=Depends(get_database)):
    users_collection = db.users
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    await users_collection.insert_one(user_dict)
    return {"msg": f"User {user.email} registered"}

@router.post("/login")
async def login_user(email: str = Form(...), password: str = Form(...), db=Depends(get_database)):
    users_collection = db.users
    user = await users_collection.find_one({"email": email})
    if not user or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"msg": f"User {email} logged in"}

