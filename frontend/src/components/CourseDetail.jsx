import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/courses/${courseId}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setCourse(data))
      .catch(() => setMsg("Course not found."))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div>Loading course...</div>;
  if (msg) return <div>{msg}</div>;
  if (!course) return null;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>{course.name}</h2>
      <p>{course.description}</p>
      <h3>Sections</h3>
      <ul>
        {course.sections.map(section => (
          <li key={section.id}>
            <Link to={`/courses/${course.id}/section/${section.id}`}>
              {section.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/courses">&larr; Back to courses</Link>
    </div>
  );
}