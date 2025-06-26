import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NoteEditor({ token, userId }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("Saving...");
    const res = await fetch("http://localhost:8000/notes/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        note_type: "text",
        title,
        content,
      }),
    });
    if (res.ok) {
      setMsg("Saved!");
      const data = await res.json();
      setTimeout(() => navigate(`/notes/${data.id}`), 700);
    } else {
      setMsg("Failed to save");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>New Note</h2>
      <form onSubmit={handleSave}>
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <textarea
          required
          placeholder="Start typing your note..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={12}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: 10 }}>
          <button type="submit">Save Note</button>
          <button type="button" onClick={() => navigate("/notes")} style={{ marginLeft: 10 }}>Cancel</button>
        </div>
      </form>
      {msg && <div>{msg}</div>}
    </div>
  );
}