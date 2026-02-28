"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function UserDetail() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/user/register");
    }
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  if (loading) return <div className="min-h-screen bg-slate-50" />;
  if (!user) return null;

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-blue-50 to-purple-100 py-8 px-4">
      <AnimatePresence>
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Top Decorative Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 w-full" />

          <div className="p-8 -mt-16 flex flex-col items-center">
            {/* Avatar with Ring Animation */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-28 h-28 rounded-3xl bg-white p-1 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold tracking-wider">
                  {user.fullName?.[0] || user.userName?.[0]}
                </div>
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div variants={itemVariants} className="text-center mt-4">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {user.fullName || "Member"}
              </h2>
              <p className="text-blue-600 font-medium">@{user.userName}</p>
            </motion.div>

            {/* Details Section */}
            <motion.div variants={itemVariants} className="w-full mt-8 space-y-4">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Email Address</p>
                <p className="text-slate-700 font-medium">{user.email}</p>
              </div>
              
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Account Status</p>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-slate-700 font-medium">Active</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="w-full mt-10">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold tracking-wide hover:bg-slate-800 transition-colors shadow-lg"
              >
                Sign Out
              </motion.button>
              
              <p className="text-center text-slate-400 text-sm mt-6">
                Logged in since {new Date().toLocaleDateString()}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}