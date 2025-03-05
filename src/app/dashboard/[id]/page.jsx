"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UserDashboard() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${id}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">User Dashboard</h2>
        {userData ? (
          <div>
            <p><strong>ID:</strong> {userData.id}</p>
            <p><strong>Name:</strong> {userData.user}</p>
            <p><strong>CPU Usage:</strong> {userData.cpu_usage}%</p>
            <p><strong>Memory Used:</strong> {userData.memory_used} GB</p>
            <p><strong>Disk Used:</strong> {userData.disk_used} GB</p>
          </div>
        ) : (
          <p className="text-center text-gray-400">Loading user data...</p>
        )}
      </div>
    </div>
  );
}
