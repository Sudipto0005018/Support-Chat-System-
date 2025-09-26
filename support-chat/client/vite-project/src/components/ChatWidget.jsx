import React, { useState } from "react";
import Chat from "../pages/Chat";
import "./chatwidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {open && (
        <div className="chat-panel">
          <Chat onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
      >
        💬
      </button>
    </div>
  );
}
