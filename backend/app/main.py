from fastapi import FastAPI
from app.routes import  users,course, tutor, quiz, progress, recommend, auth, notes
import logging
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Personalized Learning Platform Backend",
    description="Backend API for adaptive tutor, quiz, progress tracking, and recommendations"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Or ["*"] for dev, restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routers for modular endpoints
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(course.router)
app.include_router(tutor.router)
app.include_router(quiz.router)
app.include_router(progress.router)
app.include_router(recommend.router)
app.include_router(notes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to your FastAPI backend!"}

for route in app.routes:
    logging.info(f"Route: {route.path} (name: {route.name}, methods: {route.methods})")

# from app.routes import user

# app = FastAPI()

# app.include_router(user.router)

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to your FastAPI backend!"}