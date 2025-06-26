import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotesDashboard({ token, userId }) {
  const [notes, setNotes] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/notes/?user_id=${userId}`)
      .then(res => res.json())
      .then(setNotes)
      .catch(() => setMsg("Failed to load notes"))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append("user_id", userId);
    form.append("file", file);
    if (uploadTitle) form.append("title", uploadTitle);
    setMsg("Uploading...");
    const res = await fetch("http://localhost:8000/notes/upload", {
      method: "POST",
      body: form,
    });
    if (res.ok) {
      setMsg("Uploaded!");
      setFile(null);
      setUploadTitle("");
      const data = await res.json();
      setNotes(n => [data, ...n]);
    } else {
      setMsg("Failed to upload");
    }
  };

  if (loading) return <div>Loading notes...</div>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>My Notes</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/notes/new")}>+ New Note</button>
      </div>
      <form onSubmit={handleUpload} style={{ marginBottom: 20 }}>
        <label>
          <b>Upload File (PDF/Image):</b>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={e => setFile(e.target.files[0])}
            required
          />
        </label>
        <input
          type="text"
          placeholder="Optional title"
          value={uploadTitle}
          onChange={e => setUploadTitle(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>
      {msg && <div>{msg}</div>}
      <ul>
        {notes.map(note => (
          <li key={note.id} style={{ marginBottom: 10 }}>
            <Link to={`/notes/${note.id}`}>
              {note.title || (note.note_type === "file" ? note.original_filename : "Untitled Note")}
            </Link>
            {" "}
            <span style={{ color: "#888" }}>
              ({note.note_type === "file" ? "File" : "Text"}){" "}
              {note.created_at && new Date(note.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}