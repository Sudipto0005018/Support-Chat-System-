/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BotEditor({ token }) {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchNodes();
  }, []);

  async function fetchNodes() {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/bot/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNodes(res.data);
    } catch (e) {
      console.error(e);
      setNodes([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveNode(node) {
    if (node._id) {
      await axios.put(`${apiUrl}/api/bot/${node._id}`, node, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${apiUrl}/api/bot`, node, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    fetchNodes();
    setEditing(null);
  }

  async function removeNode(id) {
    if (!confirm("Delete node?")) return;
    await axios.delete(`${apiUrl}/api/bot/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNodes();
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>Bot Editor</h3>
      <p>Create / edit bot nodes (decision-tree)</p>
      <button
        onClick={() => setEditing({ title: "", message: "", options: [] })}
      >
        New node
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {nodes.map((n) => (
            <div key={n._id} style={{ border: "1px solid #ddd", padding: 12 }}>
              <div>
                <b>{n.title}</b>
              </div>
              <div style={{ fontSize: 13, color: "#333" }}>{n.message}</div>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => setEditing(n)}>Edit</button>
                <button
                  onClick={() => removeNode(n._id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <NodeEditor
          node={editing}
          onCancel={() => setEditing(null)}
          onSave={saveNode}
          nodes={nodes}
        />
      )}
    </div>
  );
}

function NodeEditor({ node: initial, onCancel, onSave, nodes }) {
  const [node, setNode] = useState(initial);
  useEffect(() => setNode(initial), [initial]);

  function setField(k, v) {
    setNode((s) => ({ ...s, [k]: v }));
  }
  function addOption() {
    setNode((s) => ({
      ...s,
      options: [
        ...(s.options || []),
        { label: "", nextNode: null, createTicket: false },
      ],
    }));
  }
  function updateOption(i, key, val) {
    const ops = [...(node.options || [])];
    ops[i] = { ...ops[i], [key]: val };
    setNode((s) => ({ ...s, options: ops }));
  }
  function removeOption(i) {
    const ops = [...(node.options || [])];
    ops.splice(i, 1);
    setNode((s) => ({ ...s, options: ops }));
  }

  return (
    <div style={{ marginTop: 12, border: "1px solid #eee", padding: 12 }}>
      <h4>{node._id ? "Edit node" : "New node"}</h4>
      <input
        value={node.title || ""}
        onChange={(e) => setField("title", e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={node.message || ""}
        onChange={(e) => setField("message", e.target.value)}
        placeholder="Message"
      />
      <div>
        <h5>Options</h5>
        {(node.options || []).map((op, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <input
              value={op.label}
              placeholder="Label"
              onChange={(e) => updateOption(i, "label", e.target.value)}
            />
            <select
              value={op.nextNode || ""}
              onChange={(e) =>
                updateOption(i, "nextNode", e.target.value || null)
              }
            >
              <option value="">-- choose next node --</option>
              {nodes.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.title || n._id}
                </option>
              ))}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={!!op.createTicket}
                onChange={(e) =>
                  updateOption(i, "createTicket", e.target.checked)
                }
              />{" "}
              Create ticket
            </label>
            <button onClick={() => removeOption(i)}>Remove</button>
          </div>
        ))}
        <button onClick={addOption}>Add option</button>
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => onSave(node)}>Save</button>
        <button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
