import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/progress/${user.user_id}`).then(r => setStats(r.data)).catch(() => {
      setStats({ name: user.name, role: user.role, xp: 0, streak: 0, lessons_completed: 0, average_score: 0, level: 1 });
    });
  }, [user]);

  if (!stats) return <div style={{textAlign:"center",padding:"80px",color:"#64748b"}}>Loading...</div>;

  const xpInLevel = stats.xp % 100;
  const roleIcon = { healthcare:"🏥", retail:"🛒", construction:"🏗️", logistics:"📦" }[stats.role] || "👷";
  const statItems = [
    { icon:"📚", value: stats.lessons_completed, label: "Lessons Done" },
    { icon:"⭐", value: `${stats.average_score}%`, label: "Avg Score" },
    { icon:"🔥", value: stats.streak, label: "Day Streak" },
    { icon:"🏆", value: stats.level, label: "Level" },
  ];

  return (
    <div style={{ padding: "24px 16px 100px", maxWidth: "480px", margin: "0 auto" }}>
      <h2 style={{ color: "#38bdf8", fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px" }}>📊 Your Progress</h2>
      <div style={{ background: "linear-gradient(135deg, #0369a1, #1d4ed8)", borderRadius: "20px", padding: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>{roleIcon}</div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{stats.name}</h3>
            <p style={{ color: "#bae6fd", textTransform: "capitalize" }}>{stats.role} Worker</p>
            <p style={{ color: "#7dd3fc", fontSize: "0.85rem" }}>Level {stats.level} • {stats.xp} XP</p>
          </div>
        </div>
        <div style={{ fontSize: "0.75rem", color: "#bae6fd", display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span>Level {stats.level}</span><span>{xpInLevel}/100 XP to next</span>
        </div>
        <div style={{ width: "100%", height: "10px", background: "rgba(255,255,255,0.2)", borderRadius: "5px" }}>
          <div style={{ width: `${xpInLevel}%`, height: "10px", background: "white", borderRadius: "5px" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {statItems.map(s => (
          <div key={s.label} style={{ background: "#1e293b", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "4px" }}>{s.icon}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#38bdf8" }}>{s.value}</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
