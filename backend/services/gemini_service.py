import google.generativeai as genai
import os
from PIL import Image
import io, base64, json, re

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
text_model = genai.GenerativeModel("gemini-1.5-flash")
vision_model = genai.GenerativeModel("gemini-1.5-flash")

SYSTEM_CONTEXT = """
You are CyberWave AI — a friendly assistant for frontline workers.
- Keep answers SHORT and actionable
- Use simple language
- Be encouraging and positive
- Prioritize safety information first
- Respond in the same language as the user
"""

async def ask_gemini(question, role="worker", language="en", history=[]):
    context = f"{SYSTEM_CONTEXT}\nWorker role: {role}\nRespond in: {language}"
    chat = text_model.start_chat(history=history)
    response = chat.send_message(f"{context}\n\nQuestion: {question}")
    return response.text

async def analyze_image(image_b64, question, role="worker"):
    image_data = base64.b64decode(image_b64)
    image = Image.open(io.BytesIO(image_data))
    prompt = f"{SYSTEM_CONTEXT}\nRole: {role}\nQuestion: '{question}'\nAnalyze image, mention safety hazards FIRST."
    response = vision_model.generate_content([prompt, image])
    return response.text

async def generate_quiz(topic, role, difficulty="medium", num_questions=5):
    prompt = f"""
Generate a {num_questions}-question quiz for a {role} about: {topic}
Difficulty: {difficulty}
Return ONLY valid JSON:
{{
    "title": "Quiz title",
    "questions": [
        {{
            "id": 1,
            "question": "Question text",
            "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
            "correct": "A",
            "explanation": "Why this is correct"
        }}
    ]
}}"""
    response = text_model.generate_content(prompt)
    match = re.search(r'\{.*\}', response.text, re.DOTALL)
    return json.loads(match.group()) if match else {"title": topic, "questions": []}

async def generate_lesson(topic, role, language="en"):
    prompt = f"""
Create a 2-3 min micro-lesson for a {role} about: {topic}
Language: {language}
Return ONLY valid JSON:
{{
    "title": "Lesson title",
    "summary": "One sentence summary",
    "key_points": ["point 1", "point 2", "point 3"],
    "steps": [{{"step": 1, "title": "Step title", "content": "Content"}}],
    "tip": "One practical tip",
    "safety_note": "Safety note or null"
}}"""
    response = text_model.generate_content(prompt)
    match = re.search(r'\{.*\}', response.text, re.DOTALL)
    return json.loads(match.group()) if match else {}

async def summarize_for_worker(long_text, role):
    response = text_model.generate_content(
        f"Summarize for a {role} in 3-5 bullet points. Simple language.\n\n{long_text}"
    )
    return response.text
