"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const VALID_USERNAME = "admin";  // Temporary static credentials (Replace with real authentication)
  const VALID_PASSWORD = "password123";

  const handleLogin = (e) => {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setError("Username and password are required.");
      return;
    }

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem("isAuthenticated", "true");
      router.push("/user-selection");  // 🔄 Redirect to User Selection Page
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-center mb-6">LOGIN</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
