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
            uniqueUsers.push({ id: item.id, user: item.user });
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Select a User</h2>
        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul className="space-y-2">
            {users.map(({ id, user }) => (
              <li
                key={`${id}-${user}`}
                className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 text-center flex justify-between items-center px-4 w-full"
                onClick={() => handleUserSelect(user)}
              >
                <span className="text-gray-400 font-semibold">{id}</span>
                <span className="flex-grow text-center">{user}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
