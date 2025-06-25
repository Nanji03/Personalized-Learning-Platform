#User management routes for FastAPI application
#This module handles user registration and login functionality.
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

@router.post("/register")
def register_user(user: UserCreate):
    # TODO: Add MongoDB logic
    return {"msg": f"User {user.email} registered (mock response)"}

@router.post("/login")
def login_user(email: str, password: str):
    # TODO: Add authentication logic
    return {"msg": f"User {email} logged in (mock response)"}

# from fastapi import APIRouter

# router = APIRouter()

# @router.get("/test-alive")
# def test_alive():
#     return {"status": "ok"}