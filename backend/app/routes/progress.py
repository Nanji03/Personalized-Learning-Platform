from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from app.utils.db import db

router = APIRouter(prefix="/progress", tags=["progress"])

class DailyProgress(BaseModel):
    date: str  # YYYY-MM-DD
    value: int

class ProgressResponse(BaseModel):
    user_id: str
    metric: str  # e.g. "quiz_attempts", "flashcards_reviewed"
    data: List[DailyProgress]

@router.get("/", response_model=ProgressResponse)
def get_progress(
    user_id: str = Query(..., description="User ID"),
    metric: str = Query("quiz_attempts", description="Type of metric to show progress for"),
    days: int = Query(14, description="Number of days to show progress for, default 14")
):
    """
    Returns the user's daily progress (e.g., quiz attempts, flashcards reviewed)
    as a time series suitable for a line graph.
    """
    # Determine the date range
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=days-1)
    date_list = [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days)]
    progress_dict = {d: 0 for d in date_list}

    # Example: Count quiz attempts per day from 'quiz_attempts' collection
    if metric == "quiz_attempts":
        entries = db.quiz_attempts.find({
            "user_id": user_id,
            "attempted_at": {
                "$gte": datetime.combine(start_date, datetime.min.time()),
                "$lte": datetime.combine(today, datetime.max.time())
            }
        })
        for entry in entries:
            d = entry.get("attempted_at")
            if d:
                date_str = d.strftime("%Y-%m-%d")
                if date_str in progress_dict:
                    progress_dict[date_str] += 1
    # Example: Count flashcards reviewed per day from 'flashcard_reviews' collection
    elif metric == "flashcards_reviewed":
        entries = db.flashcard_reviews.find({
            "user_id": user_id,
            "reviewed_at": {
                "$gte": datetime.combine(start_date, datetime.min.time()),
                "$lte": datetime.combine(today, datetime.max.time())
            }
        })
        for entry in entries:
            d = entry.get("reviewed_at")
            if d:
                date_str = d.strftime("%Y-%m-%d")
                if date_str in progress_dict:
                    progress_dict[date_str] += 1
    else:
        raise HTTPException(status_code=400, detail="Unsupported metric")

    data = [DailyProgress(date=d, value=progress_dict[d]) for d in date_list]
    return ProgressResponse(user_id=user_id, metric=metric, data=data)