"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", userName:"" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

// https://e-commerce-backend-psi-three.vercel.app/user/login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/home");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
      console.log(err);
      
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #ece9ff 0%, #b7caff 100%)"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 350,
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#3a3a3a" }}>Login</h2>
         <input
          name="userName"
          type="userName"
          placeholder="userName"
          value={form.userName}
          onChange={handleChange}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            fontSize: "1rem"
          }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            fontSize: "1rem"
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            fontSize: "1rem"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          Login
        </button>
          <div className="mt-6 text-center">
                  <span className="text-gray-600">create a account?</span>
                  <Link href="/" className="ml-2 text-blue-600 font-semibold hover:underline">
                    sign-up
                  </Link>
                </div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </form>
    </div>
  );
}