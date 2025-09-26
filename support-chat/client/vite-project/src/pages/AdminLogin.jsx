/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const nav = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));
      nav("/admin");
    } catch (err) {
      alert("Login failed");
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "60px auto" }}>
      <h3>Admin Login</h3>
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
