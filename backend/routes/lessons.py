from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import generate_lesson, summarize_for_worker

router = APIRouter(prefix="/api/lessons", tags=["lessons"])

TOPICS = {
    "healthcare": ["Hand Hygiene", "Patient Communication", "PPE Usage", "Medication Safety", "Emergency Response"],
    "retail": ["Customer Service", "Loss Prevention", "Product Knowledge", "POS Systems", "Inventory Management"],
    "construction": ["Fall Protection", "Hazard Communication", "Tool Safety", "First Aid", "Site Safety Plans"],
    "logistics": ["Safe Lifting", "Forklift Safety", "Loading Procedures", "Hazmat Handling", "Documentation"],
}

class LessonRequest(BaseModel):
    topic: str
    role: str
    language: str = "en"

class SummarizeRequest(BaseModel):
    text: str
    role: str

@router.get("/topics/{role}")
async def get_topics(role: str):
    return {"role": role, "topics": TOPICS.get(role.lower(), TOPICS["retail"])}

@router.post("/generate")
async def create_lesson(req: LessonRequest):
    try:
        return await generate_lesson(req.topic, req.role, req.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize")
async def summarize(req: SummarizeRequest):
    try:
        return {"summary": await summarize_for_worker(req.text, req.role)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
