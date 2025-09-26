import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ChatWidget from "./components/ChatWidget";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route
          path="/"
          element={
            <div style={{ padding: 20 }}>
              Welcome — site content here. Use the chat widget bottom-right.
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating chat widget available on all pages */}
      <ChatWidget />
    </div>
  );
}

export default App;
