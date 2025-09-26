import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { initSocket, getSocket } from "../utils/socket";
import "./chat.css";

// Simple message component
function Msg({ m }) {
  const cls =
    m.sender === "bot"
      ? "msg-bot"
      : m.sender === "admin"
      ? "msg-admin"
      : "msg-user";
  return <div className={`msg ${cls}`}>{m.text}</div>;
}

export default function Chat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [node, setNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDetails, setTicketDetails] = useState("");
  const messagesRef = useRef(null);

  // Demo user (replace with real auth)
  const user = JSON.parse(
    localStorage.getItem("user") ||
      JSON.stringify({ id: "guest", name: "Guest", token: null })
  );
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    // init socket (user room)
    initSocket(apiUrl, user.token, user.id, "user");
    const s = getSocket();

    s.on("ticket_reply", (payload) => {
      setMessages((m) => [...m, { sender: "admin", text: payload.text }]);
    });

    s.on("ticket_created", (payload) => {
      setMessages((m) => [
        ...m,
        {
          sender: "system",
          text: "Ticket created: " + (payload.subject || ""),
        },
      ]);
    });

    return () => {
      if (s) {
        s.off("ticket_reply");
        s.off("ticket_created");
      }
    };
  }, []);

  useEffect(() => {
    loadRoot();
  }, []);

  useEffect(() => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  async function loadRoot() {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/bot/root`);
      setNode(res.data);
      setMessages([{ sender: "bot", text: res.data.message }]);
    } catch (e) {
      setMessages([
        {
          sender: "bot",
          text: "Sorry — the bot flow is not available right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function chooseOption(opt) {
    setMessages((m) => [...m, { sender: "user", text: opt.label }]);
    if (opt.createTicket) {
      setCreatingTicket(true);
      return;
    }
    try {
      const res = await axios.get(`${apiUrl}/api/bot/node/${opt.nextNode}`);
      setNode(res.data);
      setMessages((m) => [...m, { sender: "bot", text: res.data.message }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { sender: "bot", text: "Error loading next step." },
      ]);
    }
  }

  async function submitTicket(e) {
    e.preventDefault();
    setCreatingTicket(false);
    try {
      await axios.post(
        `${apiUrl}/api/tickets`,
        { subject: ticketSubject, text: ticketDetails },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessages((m) => [
        ...m,
        { sender: "user", text: ticketSubject },
        { sender: "system", text: "Ticket created. Admin will reply here." },
      ]);
      setTicketSubject("");
      setTicketDetails("");
    } catch (err) {
      setMessages((m) => [
        ...m,
        { sender: "bot", text: "Failed to create ticket. Please try later." },
      ]);
    }
  }

  return (
    <div className="chat-root">
      <div className="chat-header">
        <div>Support</div>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="chat-body" ref={messagesRef}>
        {messages.map((m, i) => (
          <Msg key={i} m={m} />
        ))}
      </div>

      <div className="chat-actions">
        {loading && <div>Loading...</div>}
        {!loading && node && (
          <div className="options">
            {node.options && node.options.length > 0 ? (
              node.options.map((o, idx) => (
                <button
                  key={idx}
                  className="opt-btn"
                  onClick={() => chooseOption(o)}
                >
                  {o.label}
                </button>
              ))
            ) : (
              <div className="end">
                No more options. Create a ticket{" "}
                <button onClick={() => setCreatingTicket(true)}>here</button>
              </div>
            )}
          </div>
        )}

        {creatingTicket && (
          <form className="ticket-form" onSubmit={submitTicket}>
            <input
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="Short subject"
              required
            />
            <textarea
              value={ticketDetails}
              onChange={(e) => setTicketDetails(e.target.value)}
              placeholder="Describe your issue"
              required
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Create Ticket</button>
              <button type="button" onClick={() => setCreatingTicket(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
