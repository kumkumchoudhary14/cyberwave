import React, { useState, useContext, useRef } from "react";
import { UserContext } from "../App";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function ChatBot({ onClose }) {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([{ role: "assistant", text: `Hi ${user?.name}! 👋 Ask me anything about your work!` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", text }]);
    setInput(""); setLoading(true);
    try {
      const res = await axios.post(`${API}/api/chat/ask`, { message: text, user_id: user.user_id, role: user.role, language: user.language, history: [] });
      setMessages(prev => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch(e) {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I couldn't connect. Check your API key!" }]);
    } finally { setLoading(false); }
  };

  const sendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = reader.result.split(",")[1];
      setMessages(prev => [...prev, { role: "user", text: "📷 [Image sent]" }]);
      setLoading(true);
      try {
        const res = await axios.post(`${API}/api/chat/image`, { image_b64: b64, question: "What is this? Any safety concerns?", user_id: user.user_id, role: user.role });
        setMessages(prev => [...prev, { role: "assistant", text: res.data.reply }]);
      } finally { setLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  const s = {
    overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.97)", zIndex: 200, display: "flex", flexDirection: "column" },
    header: { padding: "16px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" },
    messages: { flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" },
    footer: { padding: "16px", borderTop: "1px solid #334155", display: "flex", gap: "8px" },
    input: { flex: 1, background: "#1e293b", border: "none", borderRadius: "12px", padding: "12px", color: "white", outline: "none" },
    iconBtn: { width: "44px", height: "44px", borderRadius: "12px", background: "#334155", border: "none", cursor: "pointer", fontSize: "1.2rem" },
    sendBtn: { width: "44px", height: "44px", borderRadius: "12px", background: "#0ea5e9", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "white" },
  };

  return (
    <div style={s.overlay}>
      <div style={s.header}>
        <span style={{ color: "#38bdf8", fontWeight: "bold" }}>🤖 AI Assistant</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: "1.3rem", cursor: "pointer" }}>✕</button>
      </div>
      <div style={s.messages}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: "16px", background: m.role === "user" ? "#0284c7" : "#1e293b", color: "white", fontSize: "0.9rem" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ padding: "10px 14px", borderRadius: "16px", background: "#1e293b", color: "#64748b", fontSize: "0.9rem" }}>Thinking... 🤔</div></div>}
      </div>
      <div style={s.footer}>
        <input type="file" accept="image/*" ref={fileRef} onChange={sendImage} style={{ display: "none" }} />
        <button style={s.iconBtn} onClick={() => fileRef.current.click()}>📷</button>
        <input style={s.input} placeholder="Ask anything..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage(input)} />
        <button style={s.sendBtn} onClick={() => sendMessage(input)}>➤</button>
      </div>
    </div>
  );
}
