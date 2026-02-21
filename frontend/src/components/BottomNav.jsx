import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { path: "/learn", icon: "📚", label: "Learn" },
  { path: "/quiz", icon: "🧠", label: "Quiz" },
  { path: "/dashboard", icon: "📊", label: "Progress" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1e293b", borderTop: "1px solid #334155", display: "flex", justifyContent: "space-around", padding: "12px 0", zIndex: 100 }}>
      {NAV.map(n => (
        <button key={n.path} onClick={() => navigate(n.path)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: pathname === n.path ? "#38bdf8" : "#475569" }}>
          <span style={{ fontSize: "1.4rem" }}>{n.icon}</span>
          <span style={{ fontSize: "0.7rem" }}>{n.label}</span>
        </button>
      ))}
    </nav>
  );
}
