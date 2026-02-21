from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import generate_quiz

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

class QuizRequest(BaseModel):
    topic: str
    role: str
    difficulty: str = "medium"
    num_questions: int = 5

class QuizSubmission(BaseModel):
    user_id: str
    quiz_id: str
    answers: dict
    correct_answers: dict

@router.post("/generate")
async def create_quiz(req: QuizRequest):
    try:
        return await generate_quiz(req.topic, req.role, req.difficulty, req.num_questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submit")
async def submit_quiz(sub: QuizSubmission):
    correct = sum(1 for qid, ans in sub.answers.items() if sub.correct_answers.get(qid) == ans)
    total = len(sub.answers)
    score = (correct / total) * 100 if total > 0 else 0
    xp = int(score / 10) * 5
    return {
        "score": round(score, 1), "correct": correct, "total": total,
        "xp_earned": xp, "passed": score >= 70,
        "message": "🎉 Great job!" if score >= 70 else "Keep practicing! 💪"
    }
