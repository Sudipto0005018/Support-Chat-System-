/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TicketsManager({ token }) {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);
  async function fetchAll() {
    const res = await axios.get(`${apiUrl}/api/tickets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTickets(res.data);
  }

  async function reply(ticketId) {
    const text = prompt("Reply text");
    if (!text) return;
    await axios.post(
      `${apiUrl}/api/tickets/${ticketId}/reply`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAll();
  }

  async function changeStatus(ticketId) {
    const status = prompt("Set status (open/pending/resolved/closed)");
    if (!status) return;
    await axios.patch(
      `${apiUrl}/api/tickets/${ticketId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAll();
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>Tickets</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {tickets.map((t) => (
          <div key={t._id} style={{ border: "1px solid #ddd", padding: 12 }}>
            <div>
              <b>{t.subject}</b> — <i>{t.status}</i>
            </div>
            <div style={{ fontSize: 12 }}>
              User: {t.user?.name} &lt;{t.user?.email}&gt;
            </div>
            <div style={{ marginTop: 8 }}>
              {t.messages.map((m, i) => (
                <div key={i}>
                  <b>{m.senderType}:</b> {m.text}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => reply(t._id)}>Reply</button>
              <button
                onClick={() => changeStatus(t._id)}
                style={{ marginLeft: 8 }}
              >
                Change status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
