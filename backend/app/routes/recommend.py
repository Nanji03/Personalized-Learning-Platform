from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import openai
import os
import re
import json

router = APIRouter(prefix="/recommend", tags=["recommend"])

class RecommendResourceRequest(BaseModel):
    user_id: str
    user_doubt: str
    preferred_format: Optional[str] = "video + article"
    difficulty: Optional[str] = "beginner"
    context: Optional[str] = None

class ResourceRecommendation(BaseModel):
    title: str
    url: str
    summary: str
    why_helpful: str

class RecommendationResponse(BaseModel):
    video_recommendation: ResourceRecommendation
    article_recommendation: ResourceRecommendation

@router.post("/resources", response_model=RecommendationResponse)
def recommend_resources(req: RecommendResourceRequest):
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not set")
    openai.api_key = openai_api_key

    system_prompt = (
        "You are a Recommendation Engine LLM that assists users in understanding programming and data science concepts "
        "by recommending helpful educational resources. Given a user's area of confusion or specific topic (in free-form text), your task is to:\n"
        "1. Understand the user’s intent and difficulty.\n"
        "2. Recommend one YouTube video and one article or blog post that explain the topic clearly.\n"
        "3. Ensure the resources are beginner-friendly unless otherwise specified.\n"
        "4. Return the result in JSON format with a title, URL, brief summary, and why it’s helpful."
    )

    user_prompt = (
        f"User case:\n"
        f"user_id: {req.user_id}\n"
        f"user_doubt: {req.user_doubt}\n"
        f"preferred_format: {req.preferred_format}\n"
        f"difficulty: {req.difficulty}\n"
        f"context: {req.context}\n\n"
        "Please provide your answer in the following JSON format:\n"
        "{\n"
        "  \"video_recommendation\": {\n"
        "    \"title\": \"...\",\n"
        "    \"url\": \"...\",\n"
        "    \"summary\": \"...\",\n"
        "    \"why_helpful\": \"...\"\n"
        "  },\n"
        "  \"article_recommendation\": {\n"
        "    \"title\": \"...\",\n"
        "    \"url\": \"...\",\n"
        "    \"summary\": \"...\",\n"
        "    \"why_helpful\": \"...\"\n"
        "  }\n"
        "}"
    )

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=700,
            temperature=0.2
        )
        content = response.choices[0].message.content.strip()
        match = re.search(r'(\{[\s\S]*\})', content)
        if match:
            content = match.group(1)
        recommendations = json.loads(content)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Resource recommendation failed: {str(e)}")