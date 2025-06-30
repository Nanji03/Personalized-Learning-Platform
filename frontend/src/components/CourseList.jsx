import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/courses/")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => setMsg("Failed to load courses."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (msg) return <div>{msg}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2><b>Courses</b></h2>
      <ul>
        {courses.map(course => (
          <li key={course.id} style={{ marginBottom: "1rem" }}>
            <Link to={`/courses/${course.id}`}>
              <strong>{course.name}</strong>
            </Link>
            <div>{course.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}