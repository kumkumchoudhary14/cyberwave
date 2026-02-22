# 🌊 CyberWave — AI-Powered Microlearning for Frontline Workers

![CyberWave Banner](https://img.shields.io/badge/CyberWave-AI%20Learning-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11-green?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-teal?style=for-the-badge&logo=fastapi)
![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3-orange?style=for-the-badge)

> **Bite-sized, AI-generated lessons for nurses, retail staff, construction workers, and logistics teams — in any language, in under 3 minutes.**

---

## 🎯 What is CyberWave?

CyberWave is a full-stack AI microlearning platform designed for frontline workers who don't have time for long training courses. Workers can:

- 📚 Get **AI-generated micro-lessons** tailored to their role
- 🧠 Take **AI-generated quizzes** to test knowledge
- 🤖 Chat with an **AI assistant** for instant on-the-job help
- 📊 Track **XP points, levels, and learning streaks**
- 🌍 Learn in **multiple languages**

---

## 🚀 Demo

> 🎬 [Watch Demo Video](#) | 🌐 [Live App](#)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, JavaScript, CSS |
| **Backend** | FastAPI, Python 3.11 |
| **AI Engine** | Groq API (LLaMA 3.3 70B) |
| **Database** | SQLite + SQLAlchemy |
| **Server** | Uvicorn |

---

## 📁 Project Structure

```
cyberwave/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── database.py              # SQLite database setup
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # API keys (not committed)
│   ├── routes/
│   │   ├── lessons.py           # Lesson generation routes
│   │   ├── quiz.py              # Quiz generation routes
│   │   ├── chat.py              # AI chat routes
│   │   └── progress.py         # XP & progress routes
│   └── services/
│       └── gemini_service.py    # AI service (Groq API)
└── frontend/
    ├── public/
    └── src/
        ├── App.js               # Main app component
        ├── components/
        │   ├── LessonCard.js    # Lesson display
        │   ├── QuizCard.js      # Quiz display
        │   ├── ChatBot.js       # AI chat widget
        │   └── Progress.js      # XP progress tracker
        └── pages/
            ├── Home.js          # Role selection page
            └── Learn.js         # Learning dashboard
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Gemini API Key (free at gemini)
---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/kumkumchoudhary14/cyberwave.git
cd cyberwave
```

---

### 2️⃣ Backend Setup
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate      # Mac/Linux
# venv\Scripts\activate       # Windows

pip install -r requirements.txt
```

---

### 3️⃣ Configure Environment Variables
```bash
cp .env.example .env
nano .env
```

Add your API key:
```env
GEMINI_API_KEY=your_gemini
_api_key_here
DATABASE_URL=sqlite:///./cyberwave.db
```

---

### 4️⃣ Start Backend
```bash
uvicorn main:app --reload
```
✅ Backend runs at: `http://localhost:8000`

---

### 5️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
✅ Frontend runs at: `http://localhost:3000`

---

## 🔑 Get a Free Groq API Key

1. Go to 👉 [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Go to **API Keys** → **Create API Key**
4. Copy and paste into your `.env` file

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lessons/topics/{role}` | Get topics for a role |
| `POST` | `/api/lessons/generate` | Generate AI lesson |
| `POST` | `/api/quiz/generate` | Generate AI quiz |
| `POST` | `/api/chat/ask` | Ask AI assistant |
| `POST` | `/api/progress/setup` | Setup user progress |
| `GET` | `/api/progress/{user_id}` | Get user XP & level |

---

## 👥 Supported Roles

| Role | Topics |
|------|--------|
| 🏥 Healthcare | Hand Hygiene, PPE Usage, Patient Communication, Medication Safety, Emergency Response |
| 🛒 Retail | Customer Service, Loss Prevention, Product Knowledge, Cash Handling, Safety Procedures |
| 🏗️ Construction | Safety Equipment, Tool Usage, Emergency Procedures, Site Safety, Hazard Identification |
| 📦 Logistics | Warehouse Safety, Package Handling, Route Planning, Vehicle Safety, Inventory Management |

---

## 🏆 Hackathon

Built for Cyberwave

---

## 📄 License

MIT License — feel free to use and modify!

---

## 🙌 Built By

**Kumkum Choudhary** — [@kumkumchoudhary14](https://github.com/kumkumchoudhary14)

---

⭐ **Star this repo if you found it useful!**
