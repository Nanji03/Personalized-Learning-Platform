from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime
from app.utils.db import db  # Uses your MongoDB client setup
from bson.objectid import ObjectId
##from app.utils.your_module import generate_ai_answer
def generate_ai_answer(prompt: str) -> str:
    return "This is a mock AI answer for: " + prompt

router = APIRouter(prefix="/tutor", tags=["tutor"])

class PromptRequest(BaseModel):
    user_id: str
    prompt: str
    topic: str

class TutorResponse(BaseModel):
    id: str
    answer: str

class Flashcard(BaseModel):
    question: str
    answer: str

@router.post("/ask", response_model=TutorResponse)
def ask_tutor(request: PromptRequest):
    answer = generate_ai_answer(request.prompt)
    doc = {
        "user_id": request.user_id,
        "prompt": request.prompt,
        "answer": answer,
        "topic": request.topic,
        "created_at": datetime.utcnow(),
    }
    result = db.tutor_history.insert_one(doc)
    return TutorResponse(id=str(result.inserted_id), answer=answer)

@router.get("/history", response_model=List[TutorResponse])
def get_history(user_id: str = Query(...)):
    entries = db.tutor_history.find({"user_id": user_id})
    return [TutorResponse(id=str(e["_id"]), answer=e["answer"]) for e in entries]

@router.get("/history/{history_id}", response_model=TutorResponse)
def get_history_item(history_id: str):
    entry = db.tutor_history.find_one({"_id": ObjectId(history_id)})
    if not entry:
        raise HTTPException(status_code=404, detail="History entry not found")
    return TutorResponse(id=str(entry["_id"]), answer=entry["answer"])

@router.get("/flashcards/{user_id}")
def get_flashcards_by_topic(user_id: str):
    entries = db.tutor_history.find({"user_id": user_id})
    result = {}
    for e in entries:
        topic = e.get("topic", "Unknown")
        if topic not in result:
            result[topic] = []
        result[topic].append({
            "question": e["prompt"],
            "answer": e["answer"],
            "_id": str(e["_id"]),  # include for frontend review tracking
        })
    return result