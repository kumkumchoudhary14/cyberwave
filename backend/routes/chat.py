from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import ask_gemini, analyze_image
from typing import List

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    user_id: str
    role: str = "worker"
    language: str = "en"
    history: List[dict] = []

class ImageRequest(BaseModel):
    image_b64: str
    question: str
    user_id: str
    role: str = "worker"

@router.post("/ask")
async def chat_with_ai(req: ChatRequest):
    try:
        reply = await ask_gemini(req.message, req.role, req.language, req.history)
        return {"reply": reply, "xp_earned": 2}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image")
async def analyze_workplace_image(req: ImageRequest):
    try:
        reply = await analyze_image(req.image_b64, req.question, req.role)
        return {"reply": reply, "xp_earned": 5}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
