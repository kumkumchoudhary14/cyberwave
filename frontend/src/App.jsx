import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import BottomNav from "./components/BottomNav";

export const UserContext = React.createContext();

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("cw_user")) || null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div style={{ minHeight: "100vh", background: "#0f172a", color: "white" }}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/learn" /> : <Home />} />
            <Route path="/learn" element={user ? <Learn /> : <Navigate to="/" />} />
            <Route path="/quiz" element={user ? <Quiz /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          </Routes>
          {user && <BottomNav />}
        </div>
      </Router>
    </UserContext.Provider>
  );
}
