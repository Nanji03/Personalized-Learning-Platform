import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function NoteViewer({ token, userId }) {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/notes/${noteId}?user_id=${userId}`)
      .then(res => res.json())
      .then(setNote)
      .catch(() => setMsg("Could not load note"));
  }, [noteId, userId]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    const res = await fetch(`http://localhost:8000/notes/${noteId}?user_id=${userId}`, {
      method: "DELETE"
    });
    if (res.ok) {
      navigate("/notes");
    } else {
      setMsg("Failed to delete");
    }
  };

  // Download text note as .txt
  const handleDownloadText = () => {
    window.open(`http://localhost:8000/notes/download/${note.id}?user_id=${userId}`, "_blank");
  };

  if (!note) return <div>{msg || "Loading..."}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>{note.title || (note.note_type === "file" ? note.original_filename : "Untitled Note")}</h2>
      {note.note_type === "text" && (
        <>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 10 }}>{note.content}</pre>
          <button onClick={handleDownloadText}>Download as .txt</button>
        </>
      )}
      {note.note_type === "file" && (
        <div>
          {note.filetype && note.filetype.startsWith("image/") ? (
            <>
              <img
                src={`http://localhost:8000/notes/file/${note.filename}`}
                alt={note.original_filename}
                style={{ maxWidth: "100%" }}
              />
              <a
                href={`http://localhost:8000/notes/file/${note.filename}`}
                download={note.original_filename}
              >
                <button>Download Original File</button>
              </a>
            </>
          ) : note.filetype === "application/pdf" ? (
            <>
              <iframe
                src={`http://localhost:8000/notes/file/${note.filename}`}
                title={note.original_filename}
                width="100%"
                height="600px"
              />
              <a
                href={`http://localhost:8000/notes/file/${note.filename}`}
                download={note.original_filename}
              >
                <button>Download PDF</button>
              </a>
            </>
          ) : (
            <a
              href={`http://localhost:8000/notes/file/${note.filename}`}
              download={note.original_filename}
            >
              <button>Download File</button>
            </a>
          )}
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate("/notes")}>Back to Notes</button>
        <button onClick={handleDelete} style={{ marginLeft: 10, color: "red" }}>Delete</button>
      </div>
    </div>
  );
}