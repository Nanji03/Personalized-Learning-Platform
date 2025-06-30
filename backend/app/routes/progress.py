from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from app.utils.db import db

router = APIRouter(prefix="/progress", tags=["progress"])

class DailyProgress(BaseModel):
    date: str  # YYYY-MM-DD
    value: int

class ProgressResponse(BaseModel):
    user_id: str
    metric: str
    data: List[DailyProgress]
    summary: Optional[Dict[str, int]] = None  # E.g. total, average

def fetch_metric(user_id, metric, start_date, today, date_list):
    # Map metric to db collection and date field
    metric_map = {
        "quiz_attempts": ("quiz_attempts", "attempted_at"),
        "flashcards_reviewed": ("flashcard_reviews", "reviewed_at"),
    }
    if metric not in metric_map:
        raise HTTPException(status_code=400, detail="Unsupported metric")
    collection_name, date_field = metric_map[metric]
    entries = db[collection_name].find({
        "user_id": user_id,
        date_field: {
            "$gte": datetime.combine(start_date, datetime.min.time()),
            "$lte": datetime.combine(today, datetime.max.time())
        }
    })
    progress_dict = {d: 0 for d in date_list}
    for entry in entries:
        d = entry.get(date_field)
        if d:
            date_str = d.strftime("%Y-%m-%d")
            if date_str in progress_dict:
                progress_dict[date_str] += 1
    return progress_dict

@router.get("/", response_model=ProgressResponse)
def get_progress(
    user_id: str = Query(..., description="User ID"),
    metric: str = Query("quiz_attempts", description="Type of metric to show progress for"),
    days: int = Query(14, description="Number of days to show progress for, default 14")
):
    """
    Returns the user's daily progress (e.g., quiz attempts, flashcards reviewed)
    as a time series suitable for a line graph, plus summary stats.
    """
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=days-1)
    date_list = [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days)]
    progress_dict = fetch_metric(user_id, metric, start_date, today, date_list)
    data = [DailyProgress(date=d, value=progress_dict[d]) for d in date_list]
    # Calculate summary stats
    summary = {
        "total": sum(progress_dict.values()),
        "average": round(sum(progress_dict.values()) / days, 2)
    }
    return ProgressResponse(user_id=user_id, metric=metric, data=data, summary=summary)