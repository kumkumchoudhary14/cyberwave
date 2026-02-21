from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cyberwave.db")
gine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String)
    role = Column(String)
    language = Column(String, default="en")
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    last_active = Column(DateTime, default=datetime.utcnow)

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(String, primary_key=True)
    title = Column(String)
    sector = Column(String)
    content = Column(Text)
    difficulty = Column(String)
    duration_min = Column(Integer)
    completed_by = Column(Text, default="[]")

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String)
    lesson_id = Column(String)
    score = Column(Float)
    completed_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()