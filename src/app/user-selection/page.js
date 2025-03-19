"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSelectionPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-400">
        Connected Systems
      </h2>

      {loading ? (
        <p className="text-center text-lg">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {users.map(({ user, ipAddress, status }) => (
            <div
              key={user}
              className="p-8 bg-gray-800 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-gray-600"
              onClick={() => handleUserSelect(user)}
            >
              <h3 className="text-2xl font-bold">{user}</h3>
              <p className="text-lg text-gray-400 mt-2">IP: {ipAddress}</p>
              <p
                className={`text-lg font-bold mt-3 ${
                  status.toLowerCase() === "active"
                    ? "text-green-400"
                    : status.toLowerCase() === "inactive"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {status.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
