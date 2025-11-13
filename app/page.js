"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserRegister() {
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkDB() {
      try {
        const response = await fetch("http://localhost:7000/test");
              // change url to deploy backend like this "https://e-commerce-backend-psi-three.vercel.app/test" for production 

        const data = await response.json();
        setDbStatus(data.message);
      } catch (error) {
        setDbStatus("DB connection failed");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    checkDB();
  }, []);
  
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    fullName: "",
    isLoggedIn: true,
  });
  const [error, setError] = useState("");
  const router = useRouter();
  // Redirect based on presence of "user" in localStorage:
  useEffect(() => {
    if (typeof window === "undefined") return;
    const user = localStorage.getItem("user");
    if (user) {
      router.replace("/home");
    } else {
      return
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        router.push("/home");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Checking database connection...
      </div>
    );
  }

  if (dbStatus !== "DB is connected") {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold">
        {dbStatus}
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="userName">
              Username
            </label>
            <input
              id="userName"
              name="userName"
              placeholder="Enter your username"
              value={form.userName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition"
          >
            Register
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <Link href="/user/login" className="ml-2 text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}