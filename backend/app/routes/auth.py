from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from app.utils.db import db
from datetime import datetime
from jose import jwt
import os

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(req: RegisterRequest):
    if db.users.find_one({"username": req.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_pw = pwd_context.hash(req.password)
    user = {
        "username": req.username,
        "email": req.email,
        "hashed_password": hashed_pw,
        "created_at": datetime.utcnow(),
    }
    db.users.insert_one(user)
    return {"msg": "Registration successful"}

@router.post("/login")
def login(req: LoginRequest):
    user = db.users.find_one({"username": req.username})
    if not user or not pwd_context.verify(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token_data = {
        "user_id": str(user["_id"]),
        "username": user["username"]
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}