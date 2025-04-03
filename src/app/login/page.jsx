"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      router.push("/user-selection");
    }

    // Load theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    if (username === "admin" && password === "password123") {
      localStorage.setItem("isAuthenticated", "true"); // Set authentication flag
      router.push("/user-selection");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div
  className={`flex min-h-screen transition-colors duration-300 ${
    darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
  }`}
>
  {/* Left Side (Image) */}
  <div
    className="w-1/2 bg-cover bg-center"
    style={{
      backgroundImage: "url('bgl.jpeg')",
      // Replace with your image URL
    }} 
  ></div>

  {/* Right Side (Login Box) */}
  <div
    className={`flex items-center justify-center w-1/2 min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}
  >
    <div
      className={`relative p-8 rounded-lg shadow-xl w-96 border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition ${
          darkMode
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-white text-black border border-gray-300 hover:bg-gray-200"
        }`}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Login Header */}
      <h2 className="text-3xl font-bold text-center mb-6">LOGIN</h2>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Username Field */}
        <div>
          <label
            className={`block mb-2 text-base font-medium ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-3 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-400"
                : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            className={`block mb-2 text-base font-medium ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-400"
                : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#1068b0] hover:bg-[#1a6b9d] text-white p-3 rounded-md text-base font-medium transition duration-200 shadow-md"
          >
          Login
        </button>
      </form>
    </div>
  </div>
</div>

  );
}
