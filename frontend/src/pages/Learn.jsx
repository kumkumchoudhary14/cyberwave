import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import axios from "axios";
import ChatBot from "../components/ChatBot";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Learn() {
  const { user } = useContext(UserContext);
  const [topics, setTopics] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/lessons/topics/${user.role}`).then(r => setTopics(r.data.topics)).catch(() => {
      setTopics(["Safety Basics", "Communication", "Daily Tasks", "Emergency Response", "Best Practices"]);
    });
  }, [user]);

  const loadLesson = async (topic) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/lessons/generate`, { topic, role: user.role, language: user.language });
      setLesson({ ...res.data, topic });
    } catch(e) { alert("Error generating lesson. Check your API key!"); }
    finally { setLoading(false); }
  };

  const s = {
    page: { padding: "24px 16px 100px", maxWidth: "480px", margin: "0 auto" },
    heading: { color: "#38bdf8", fontSize: "1.3rem", fontWeight: "bold", marginBottom: "4px" },
    sub: { color: "#64748b", fontSize: "0.85rem", marginBottom: "20px" },
    topicBtn: { width: "100%", textAlign: "left", padding: "16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "14px", color: "white", cursor: "pointer", marginBottom: "10px", display: "flex", justifyContent: "space-between" },
    xp: { color: "#38bdf8", fontSize: "0.8rem" },
    lessonCard: { background: "#1e293b", borderRadius: "16px", padding: "20px" },
    backBtn: { color: "#38bdf8", background: "none", border: "none", cursor: "pointer", marginBottom: "16px", fontSize: "0.9rem" },
    safetyBox: { background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", borderRadius: "12px", padding: "12px", marginBottom: "16px" },
    keyPoint: { display: "flex", gap: "8px", color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "8px" },
    step: { background: "#334155", borderRadius: "10px", padding: "12px", marginBottom: "8px" },
    tipBox: { background: "rgba(14,165,233,0.15)", border: "1px solid #0ea5e9", borderRadius: "12px", padding: "12px", marginTop: "16px" },
    floatBtn: { position: "fixed", bottom: "90px", right: "16px", width: "56px", height: "56px", background: "#0ea5e9", borderRadius: "50%", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "white" },
    spinner: { textAlign: "center", padding: "48px", color: "#64748b" },
  };

  return (
    <div style={s.page}>
      <h2 style={s.heading}>👋 Hello, {user?.name}!</h2>
      <p style={s.sub}>What will you learn today?</p>

      {!lesson && !loading && topics.map(topic => (
        <button key={topic} style={s.topicBtn} onClick={() => loadLesson(topic)}>
          <span>{topic}</span>
          <span style={s.xp}>+10 XP</span>
        </button>
      ))}

      {loading && <div style={s.spinner}><div>🌊</div><p style={{marginTop:"12px"}}>Generating your lesson...</p></div>}

      {lesson && !loading && (
        <div style={s.lessonCard}>
          <button style={s.backBtn} onClick={() => setLesson(null)}>← Back to topics</button>
          <h2 style={{ fontWeight: "bold", marginBottom: "8px" }}>{lesson.title}</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "16px" }}>{lesson.summary}</p>
          {lesson.safety_note && <div style={s.safetyBox}><span style={{color:"#fca5a5"}}>⚠️ Safety: {lesson.safety_note}</span></div>}
          <h3 style={{ color: "#38bdf8", marginBottom: "10px" }}>🔑 Key Points</h3>
          {lesson.key_points?.map((p, i) => <div key={i} style={s.keyPoint}><span style={{color:"#0ea5e9"}}>✓</span>{p}</div>)}
          {lesson.steps?.map(s2 => (
            <div key={s2.step} style={s.step}>
              <p style={{ color: "#7dd3fc", fontSize: "0.85rem", fontWeight: "bold" }}>Step {s2.step}: {s2.title}</p>
              <p style={{ color: "#cbd5e1", fontSize: "0.85rem", marginTop: "4px" }}>{s2.content}</p>
            </div>
          ))}
          {lesson.tip && <div style={s.tipBox}><span style={{color:"#7dd3fc"}}>💡 Tip: {lesson.tip}</span></div>}
        </div>
      )}

      <button style={s.floatBtn} onClick={() => setShowChat(true)}>🤖</button>
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
}
