from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import openai
import os
from app.utils.db import db

router = APIRouter(prefix="/quiz", tags=["quiz"])

class QuizRequest(BaseModel):
    user_id: str
    topic: str
    skill_level: str
    learning_objective: str
    number_of_questions: int = 3

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str
    difficulty: int

class QuizAttemptRequest(BaseModel):
    user_id: str
    quiz_id: str
    score: int

@router.post("/generate", response_model=List[QuizQuestion])
def generate_quiz(request: QuizRequest):
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not set in environment variable 'OPENAI_API_KEY'")
    openai.api_key = openai_api_key

    prompt = (
        "You are a Quiz Assistant LLM module designed to generate, analyze, and evaluate quiz questions based on a given subject, "
        "difficulty level, and user profile. Given the following input data, return a quiz module with the following fields for each question:\n"
        "question: A single quiz question.\n"
        "options: A list of 4 answer options (A-D).\n"
        "correct_answer: The correct option letter (e.g., 'B').\n"
        "explanation: A brief explanation of why the answer is correct.\n"
        "difficulty: A rating from 1 (very easy) to 5 (very hard).\n"
        "Input Data:\n"
        f"user_id: {request.user_id}\n"
        f"topic: {request.topic}\n"
        f"skill_level: {request.skill_level}\n"
        f"learning_objective: {request.learning_objective}\n"
        f"number_of_questions: {request.number_of_questions}\n"
        "Return only a JSON array of quiz questions, no commentary or markdown."
    )
    
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a Quiz Assistant LLM module that generates structured quiz questions as JSON for backend use. Output must be JSON array only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1200,
            temperature=0.3
        )
        import json, re
        content = response.choices[0].message.content.strip()
        json_match = re.search(r'(\[.*\])', content, re.DOTALL)
        if json_match:
            content = json_match.group(1)
        quiz_questions = json.loads(content)
        for q in quiz_questions:
            if not all(k in q for k in ("question", "options", "correct_answer", "explanation", "difficulty")):
                raise ValueError("Missing required fields in quiz question.")
        return quiz_questions
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Quiz generation failed: {str(e)}")

@router.post("/attempt")
def record_quiz_attempt(request: QuizAttemptRequest):
    """
    Call this endpoint when a user completes a quiz attempt.
    Records the attempt in the 'quiz_attempts' collection for progress analysis.
    """
    db.quiz_attempts.insert_one({
        "user_id": request.user_id,
        "quiz_id": request.quiz_id,
        "score": request.score,
        "attempted_at": datetime.utcnow()
    })
    return {"msg": "Quiz attempt recorded"}