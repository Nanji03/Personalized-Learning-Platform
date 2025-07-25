from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime
from app.utils.db import db  # Uses your MongoDB client setup
from bson.objectid import ObjectId
import openai
import os
import openai

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_ai_answer(prompt: str) -> str:
    if not client.api_key:
        return "Error: OpenAI API key not set."
    try:
        chat_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=512,
            temperature=0.7
        )
        return chat_response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error generating AI answer: {e}"
router = APIRouter(prefix="/tutor", tags=["tutor"])

class PromptRequest(BaseModel):
    user_id: str
    prompt: str
    topic: str

class TutorResponse(BaseModel):
    id: str
    prompt: str
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
    return TutorResponse(id=str(result.inserted_id), prompt=request.prompt, answer=answer)

@router.get("/history", response_model=List[TutorResponse])
def get_history(user_id: str = Query(...)):
    entries = db.tutor_history.find({"user_id": user_id})
    return [TutorResponse(id=str(e["_id"]), prompt=e["prompt"], answer=e["answer"]) for e in entries]

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