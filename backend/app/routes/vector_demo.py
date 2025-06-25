from fastapi import APIRouter
from app.utils.langchain_chroma import get_chroma_vectorstore

router = APIRouter(prefix="/vectors", tags=["vectors"])

@router.post("/add")
def add_text(text: str):
    db = get_chroma_vectorstore()
    db.add_texts([text])
    return {"msg": "Text embedded and added successfully."}

@router.get("/query")
def query_text(query: str):
    db = get_chroma_vectorstore()
    results = db.similarity_search(query, k=3)
    return {"results": [r.page_content for r in results]}