from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class TutorHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    prompt: str
    answer: str
    topic: str  # e.g., "Python", "Machine Learning", etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)