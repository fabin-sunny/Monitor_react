"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSelectionPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/login"); // Redirect to login if not authenticated
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, [router]);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const API_BASE_URL = `http://${window.location.hostname}:9090`;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");

        const uniqueUsers = [];
        const seenUsers = new Set();

        data.forEach((item) => {
          if (!seenUsers.has(item.user)) {
            uniqueUsers.push({
              user: item.user,
              ipAddress: item.ipAddress,
              status: item.status || "unknown",
            });
            seenUsers.add(item.user);
          }
        });

        setUsers(uniqueUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (username) => {
    router.push(`/dashboard/${encodeURIComponent(username)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 py-5 transition-all duration-300
    ${
      darkMode
        ? "bg-gradient-to-r from-gray-900 via-gray-950 to-black text-white shadow-2xl drop-shadow-lg"
        : "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-2xl drop-shadow-lg"
    }
  `}
      >
        {/* Application Name */}
        <h1
          className={`text-3xl font-extrabold tracking-wide ${
            darkMode ? "text-white" : "text-white"
          }`}
        >
          SysTrack
        </h1>

        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white dark:bg-gray-700 text-black dark:text-white shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-27 flex flex-col items-center p-6">
        <h2
          className="text-3xl sm:text-2xl font-extrabold text-center mb-8 dark:text-white"
          style={{ color: darkMode ? "white" : "black" }}
        >
          CONNECTED SYSTEMS
        </h2>

        {loading ? (
          <p className="text-center text-lg">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map(({ user, ipAddress, status }) => (
              <div
                key={user}
                className={`flex items-center justify-between p-6 rounded-2xl shadow-md transform transition-transform hover:scale-105 cursor-pointer border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
                onClick={() => handleUserSelect(user)}
              >
                {/* Left Side Content */}
                <div>
                  <h3
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {user}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    IP: {ipAddress}
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      status.toLowerCase() === "active"
                        ? "text-green-500"
                        : status.toLowerCase() === "inactive"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {status.toUpperCase()}
                  </p>
                </div>

                {/* Right Side Icon */}
                <div
  className="w-14 h-14 flex items-center justify-center rounded-xl shadow-md text-white"
  style={{
    background: darkMode ? "#111827" : "#374151",
  }}
>
  💻
</div>


              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
