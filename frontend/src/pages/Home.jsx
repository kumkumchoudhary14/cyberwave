import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
const ROLES = [
  { id: "healthcare", label: "🏥 Healthcare", bg: "#ef4444" },
  { id: "retail", label: "🛒 Retail", bg: "#3b82f6" },
  { id: "construction", label: "🏗️ Construction", bg: "#eab308" },
  { id: "logistics", label: "📦 Logistics", bg: "#22c55e" },
];

export default function Home() {
  const { setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!name || !role) return alert("Please enter your name and select a role!");
    const userId = `user_${Date.now()}`;
    const newUser = { user_id: userId, name, role, language };
    try {
      await axios.post(`${API}/api/progress/setup`, newUser);
    } catch(e) { console.log("Backend not connected yet"); }
    localStorage.setItem("cw_user", JSON.stringify(newUser));
    setUser(newUser);
    navigate("/learn");
  };

  const s = {
    page: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(180deg, #0f172a 0%, #0c4a6e 100%)" },
    title: { fontSize: "2.5rem", fontWeight: "bold", color: "#38bdf8", marginBottom: "8px" },
    subtitle: { color: "#94a3b8", marginBottom: "32px", fontSize: "0.9rem" },
    card: { width: "100%", maxWidth: "380px", background: "#1e293b", borderRadius: "20px", padding: "24px" },
    label: { fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px", display: "block" },
    input: { width: "100%", padding: "12px", borderRadius: "12px", background: "#334155", color: "white", border: "none", outline: "none", fontSize: "1rem", marginBottom: "16px" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" },
    select: { width: "100%", padding: "12px", borderRadius: "12px", background: "#334155", color: "white", border: "none", marginBottom: "16px" },
    btn: { width: "100%", padding: "14px", borderRadius: "12px", background: "#0ea5e9", color: "white", border: "none", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" },
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>🌊 CyberWave</h1>
      <p style={s.subtitle}>Learn on the job, on the go</p>
      <div style={s.card}>
        <label style={s.label}>Your Name</label>
        <input style={s.input} placeholder="e.g. Maria" value={name} onChange={e => setName(e.target.value)} />
        <label style={s.label}>Your Role</label>
        <div style={s.grid}>
          {ROLES.map(r => (
            <button key={r.id} onClick={() => setRole(r.id)} style={{ padding: "12px", borderRadius: "12px", background: role === r.id ? r.bg : "#334155", color: "white", border: "none", cursor: "pointer", fontWeight: role === r.id ? "bold" : "normal" }}>
              {r.label}
            </button>
          ))}
        </div>
        <label style={s.label}>Language</label>
        <select style={s.select} value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Spanish</option>
          <option value="fr">🇫🇷 French</option>
          <option value="hi">🇮🇳 Hindi</option>
          <option value="zh">🇨🇳 Chinese</option>
        </select>
        <button style={s.btn} onClick={handleStart}>Start Learning 🚀</button>
      </div>
    </div>
  );
}
