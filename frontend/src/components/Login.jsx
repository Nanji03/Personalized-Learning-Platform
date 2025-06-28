import { useState } from "react";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      // Send as form data, not JSON
      const formData = new URLSearchParams();
      formData.append("email", form.email);
      formData.append("password", form.password);

      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!res.ok) throw new Error((await res.json()).detail || "Login failed");
      const data = await res.json();
      // You can store a token or just show a message
      if (onLogin) onLogin(data.msg);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <button type="submit">Log In</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}