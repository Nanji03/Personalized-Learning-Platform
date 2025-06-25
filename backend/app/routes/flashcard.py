from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from app.utils.db import db

router = APIRouter(prefix="/flashcard", tags=["flashcard"])

class FlashcardReviewRequest(BaseModel):
    user_id: str
    flashcard_id: str
    correct: bool

@router.post("/review")
def record_flashcard_review(request: FlashcardReviewRequest):
    """
    Call this endpoint when a user reviews a flashcard.
    Records the review in the 'flashcard_reviews' collection for progress analysis.
    """
    db.flashcard_reviews.insert_one({
        "user_id": request.user_id,
        "flashcard_id": request.flashcard_id,
        "correct": request.correct,
        "reviewed_at": datetime.utcnow()
    })
    return {"msg": "Flashcard review recorded"}