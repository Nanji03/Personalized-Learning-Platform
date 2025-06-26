import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CourseSection() {
  const { courseId, sectionId } = useParams();
  const [section, setSection] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/courses/${courseId}/section/${sectionId}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setSection(data))
      .catch(() => setMsg("Section not found."))
      .finally(() => setLoading(false));
  }, [courseId, sectionId]);

  if (loading) return <div>Loading section...</div>;
  if (msg) return <div>{msg}</div>;
  if (!section) return null;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>{section.title}</h2>
      {section.video_url && (
        <div style={{ margin: "1rem 0" }}>
          <iframe
            width="560"
            height="315"
            src={section.video_url.replace("watch?v=", "embed/")}
            title={section.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {section.resource_link && (
        <div>
          <a href={section.resource_link} target="_blank" rel="noopener noreferrer">
            Resource Link
          </a>
        </div>
      )}
      <Link to={`/courses/${courseId}`}>&larr; Back to course</Link>
    </div>
  );
}