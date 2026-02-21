import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Quiz() {
  const { user } = useContext(UserContext);
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/quiz/generate`, { topic: topic || `${user.role} safety`, role: user.role, num_questions: 5 });
      setQuiz(res.data); setAnswers({}); setCurrent(0); setResult(null);
    } catch(e) { alert("Error! Check API key."); }
    finally { setLoading(false); }
  };

  const submitQuiz = async () => {
    const correctMap = {};
    quiz.questions.forEach(q => { correctMap[q.id] = q.correct; });
    const res = await axios.post(`${API}/api/quiz/submit`, { user_id: user.user_id, quiz_id: quiz.title, answers, correct_answers: correctMap });
    setResult(res.data);
  };

  const s = {
    page: { padding: "24px 16px 100px", maxWidth: "480px", margin: "0 auto" },
    heading: { color: "#38bdf8", fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px" },
    input: { width: "100%", padding: "12px", borderRadius: "12px", background: "#1e293b", color: "white", border: "1px solid #334155", outline: "none", marginBottom: "12px", fontSize: "1rem" },
    btn: { width: "100%", padding: "14px", borderRadius: "12px", background: "#0ea5e9", color: "white", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" },
    quizCard: { background: "#1e293b", borderRadius: "16px", padding: "20px" },
    option: (selected) => ({ width: "100%", textAlign: "left", padding: "12px", borderRadius: "10px", background: selected ? "#0284c7" : "#334155", color: "white", border: "none", cursor: "pointer", marginBottom: "8px", fontSize: "0.9rem" }),
    progress: { width: "100%", height: "6px", background: "#334155", borderRadius: "3px", marginBottom: "20px" },
    progressBar: (pct) => ({ width: `${pct}%`, height: "6px", background: "#0ea5e9", borderRadius: "3px" }),
    resultCard: { background: "#1e293b", borderRadius: "16px", padding: "32px", textAlign: "center" },
  };

  const q = quiz?.questions[current];

  return (
    <div style={s.page}>
      <h2 style={s.heading}>🧠 Quiz Time</h2>

      {!quiz && !loading && (
        <>
          <input style={s.input} placeholder={`Topic (e.g. ${user?.role} safety)`} value={topic} onChange={e => setTopic(e.target.value)} />
          <button style={s.btn} onClick={startQuiz}>Generate Quiz ⚡</button>
        </>
      )}

      {loading && <div style={{textAlign:"center",padding:"48px",color:"#64748b"}}>🧠 Generating quiz...</div>}

      {quiz && !result && q && (
        <div style={s.quizCard}>
          <div style={{display:"flex",justifyContent:"space-between",color:"#64748b",fontSize:"0.85rem",marginBottom:"12px"}}>
            <span>{quiz.title}</span><span>{current+1}/{quiz.questions.length}</span>
          </div>
          <div style={s.progress}><div style={s.progressBar(((current+1)/quiz.questions.length)*100)} /></div>
          <p style={{fontWeight:"bold",marginBottom:"16px"}}>{q.question}</p>
          {q.options.map(opt => (
            <button key={opt} style={s.option(answers[q.id] === opt[0])} onClick={() => setAnswers(prev => ({...prev,[q.id]:opt[0]}))}>
              {opt}
            </button>
          ))}
          <button
            style={{...s.btn, marginTop:"16px", background: answers[q.id] ? "#0ea5e9" : "#334155"}}
            disabled={!answers[q.id]}
            onClick={() => current === quiz.questions.length - 1 ? submitQuiz() : setCurrent(c => c+1)}
          >
            {current === quiz.questions.length - 1 ? "Submit 🎯" : "Next →"}
          </button>
        </div>
      )}

      {result && (
        <div style={s.resultCard}>
          <div style={{fontSize:"3rem",marginBottom:"12px"}}>{result.passed ? "🎉" : "💪"}</div>
          <h2 style={{fontSize:"2rem",fontWeight:"bold",marginBottom:"8px"}}>{result.score}%</h2>
          <p style={{color:"#94a3b8",marginBottom:"8px"}}>{result.correct}/{result.total} correct</p>
          <p style={{color:"#38bdf8",fontWeight:"bold",marginBottom:"8px"}}>+{result.xp_earned} XP!</p>
          <p style={{color:"#94a3b8",marginBottom:"20px"}}>{result.message}</p>
          <button style={s.btn} onClick={() => {setQuiz(null);setResult(null);}}>Try Another Quiz</button>
        </div>
      )}
    </div>
  );
}
