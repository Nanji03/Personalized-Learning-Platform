from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from typing import List, Optional, Union
from uuid import uuid4
from datetime import datetime
import os
from app.utils.db import db

router = APIRouter(prefix="/notes", tags=["notes"])

UPLOAD_DIR = "uploaded_notes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class NoteBase(BaseModel):
    user_id: str
    note_type: str  # "text" or "file"
    created_at: Optional[datetime] = None

class TextNoteCreate(NoteBase):
    content: str
    title: Optional[str] = None

class FileNoteCreate(NoteBase):
    filename: str
    original_filename: str
    filetype: str
    title: Optional[str] = None

class NoteOut(BaseModel):
    id: str
    user_id: str
    note_type: str  # "text" or "file"
    title: Optional[str]
    content: Optional[str] = None
    filename: Optional[str] = None
    original_filename: Optional[str] = None
    filetype: Optional[str] = None
    created_at: Optional[datetime]

@router.post("/text", response_model=NoteOut)
def create_text_note(note: TextNoteCreate):
    note_id = str(uuid4())
    doc = note.dict()
    doc.update({
        "id": note_id,
        "created_at": datetime.utcnow()
    })
    db.notes.insert_one(doc)
    return NoteOut(id=note_id, **doc)

@router.post("/upload", response_model=NoteOut)
def upload_file_note(
    user_id: str = Form(...),
    title: str = Form(None),
    file: UploadFile = File(...)
):
    note_id = str(uuid4())
    # Save file
    ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{note_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    doc = {
        "id": note_id,
        "user_id": user_id,
        "note_type": "file",
        "filename": safe_filename,
        "original_filename": file.filename,
        "filetype": file.content_type,
        "title": title,
        "created_at": datetime.utcnow()
    }
    db.notes.insert_one(doc)
    return NoteOut(**doc)

@router.get("/download/{note_id}")
def download_text_note(note_id: str, user_id: str):
    note = db.notes.find_one({"id": note_id, "user_id": user_id})
    if not note or note.get("note_type") != "text":
        raise HTTPException(status_code=404, detail="Text note not found")
    filename = (note.get("title") or "note").replace(" ", "_") + ".txt"
    return Response(
        note["content"],
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/", response_model=List[NoteOut])
def list_notes(user_id: str):
    notes = list(db.notes.find({"user_id": user_id}))
    for n in notes:
        n["id"] = str(n["id"])
    return notes

@router.get("/{note_id}", response_model=NoteOut)
def get_note(note_id: str, user_id: str):
    note = db.notes.find_one({"id": note_id, "user_id": user_id})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note["id"] = str(note["id"])
    return note

@router.get("/file/{filename}")
def serve_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@router.delete("/{note_id}", response_model=dict)
def delete_note(note_id: str, user_id: str):
    note = db.notes.find_one({"id": note_id, "user_id": user_id})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.get("note_type") == "file" and note.get("filename"):
        file_path = os.path.join(UPLOAD_DIR, note["filename"])
        if os.path.exists(file_path):
            os.remove(file_path)
    db.notes.delete_one({"id": note_id, "user_id": user_id})
    return {"msg": "Note deleted"}