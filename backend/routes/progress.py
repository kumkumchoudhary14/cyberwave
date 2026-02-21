from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, User, Progress
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/progress", tags=["progress"])

class UserSetup(BaseModel):
    user_id: str
    name: str
    role: str
    language: str = "en"

@router.post("/setup")
async def setup_user(user: UserSetup, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.id == user.user_id).first():
        db.add(User(id=user.user_id, name=user.name, role=user.role, language=user.language))
        db.commit()
        return {"status": "created"}
    return {"status": "exists"}

@router.get("/{user_id}")
async def get_progress(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"xp": 0, "streak": 0, "lessons_completed": 0, "level": 1}
    scores = db.query(Progress).filter(Progress.user_id == user_id).all()
    avg = sum(p.score for p in scores) / len(scores) if scores else 0
    return {
        "name": user.name, "role": user.role, "xp": user.xp,
        "streak": user.streak, "lessons_completed": len(scores),
        "average_score": round(avg, 1), "level": user.xp // 100 + 1
    }

@router.post("/award-xp/{user_id}")
async def award_xp(user_id: str, xp: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.xp += xp
        user.last_active = datetime.utcnow()
        db.commit()
    return {"new_xp": user.xp if user else xp}
