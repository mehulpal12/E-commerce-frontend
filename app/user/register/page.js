"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    fullName: "",
    isLoggedIn: true,
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) router.replace("/home");
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", data.data.token);
        router.push("/home");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server connection failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden px-4">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/50 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-[120px] animate-pulse" />

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-[450px] bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12"
      >
        <motion.div variants={itemVars} className="mb-10 text-center">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Join Us</h2>
          <p className="text-slate-500 font-medium">Start your journey with us today.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
            { id: "userName", label: "Username", type: "text", placeholder: "johndoe123" },
            { id: "email", label: "Email", type: "email", placeholder: "name@example.com" },
            { id: "password", label: "Password", type: "password", placeholder: "••••••••" }
          ].map((input) => (
            <motion.div key={input.id} variants={itemVars}>
              <label className="block text-sm font-bold text-slate-700 ml-1 mb-1.5" htmlFor={input.id}>
                {input.label}
              </label>
              <input
                id={input.id}
                name={input.id}
                type={input.type}
                placeholder={input.placeholder}
                value={form[input.id]}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 placeholder:text-slate-300 shadow-sm"
              />
            </motion.div>
          ))}

          <motion.div variants={itemVars} className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className={`w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800'}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Create Account"}
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-xl border border-red-100"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        <motion.div variants={itemVars} className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-500 font-medium">
            Already have an account? 
            <Link href="/user/login" className="ml-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;