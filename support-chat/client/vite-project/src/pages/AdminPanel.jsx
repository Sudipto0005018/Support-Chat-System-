/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import axios from "axios";
import BotEditor from "../sections/BotEditor";
import TicketsManager from "../sections/TicketsManager";
import { initSocket, getSocket } from "../utils/socket";
import "./admin.css";

function AdminHome() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      <p>Use the sidebar to manage the bot and tickets.</p>
    </div>
  );
}

export default function AdminPanel() {
  const nav = useNavigate();
  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("adminUser") || "null");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return nav("/admin/login");
    initSocket(apiUrl, token, user?.id, "admin");
    const s = getSocket();
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("ticket_created", (payload) => {
      console.log("new ticket", payload);
    });
    return () => {
      if (s) {
        s.off("connect");
        s.off("disconnect");
      }
    };
  }, []);

  function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    nav("/admin/login");
  }

  return (
    <div className="admin-root">
      <aside className="admin-side">
        <div className="brand">Support Admin</div>
        <nav>
          <Link to="/admin">Home</Link>
          <Link to="/admin/bot">Bot Editor</Link>
          <Link to="/admin/tickets">Tickets</Link>
        </nav>
        <div style={{ marginTop: "auto", padding: 12 }}>
          <div style={{ fontSize: 12 }}>
            Socket: {connected ? "connected" : "disconnected"}
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/bot" element={<BotEditor token={token} />} />
          <Route path="/tickets" element={<TicketsManager token={token} />} />
        </Routes>
      </main>
    </div>
  );
}
