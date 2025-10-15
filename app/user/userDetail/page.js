"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDetail() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Example: get user from localStorage or fetch from API
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Optionally, fetch user from backend here
      // fetch("/api/user/me").then...
    }
  }, []);

  const logout = function () {
     localStorage.removeItem("user");
     router.push("/")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="text-lg text-gray-600">please create accout</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
            {user.fullName
              ? user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : user.userName[0].toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-1">{user.fullName}</h2>
          <p className="text-gray-500 mb-4">@{user.userName}</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <span className="w-32 font-semibold text-gray-700">Email:</span>
            <span className="text-gray-600">{user.email}</span>
            
    
          </div>
          <div className="mt-6 space-y-4">
          <div className="flex justify-center">
            <button
              onClick={logout}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-purple-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}