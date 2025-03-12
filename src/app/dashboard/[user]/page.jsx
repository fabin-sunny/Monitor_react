"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import StatsChart from "@components/StatsChart";

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useParams();
  const decodedUser = decodeURIComponent(user); // 🔹 Fix URL encoding issue

  const [statsHistory, setStatsHistory] = useState([]);
  const [userProcesses, setUserProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processLoading, setProcessLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    }
  }, [router]);

  const API_BASE_URL =
    typeof window !== "undefined"
      ? `http://${window.location.hostname}:9090`
      : "http://localhost:9090";

  const fetchData = useCallback(async () => {
    if (!decodedUser) return;

    try {
      const [statsResponse, processResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/stats`),
        fetch(`${API_BASE_URL}/api/processes`),
      ]);

      const [statsData, processData] = await Promise.all([
        statsResponse.json(),
        processResponse.json(),
      ]);

      // 🔹 Validate API responses
      if (!Array.isArray(statsData) || !Array.isArray(processData)) {
        console.error("Invalid API response format.");
        setLoading(false);
        setProcessLoading(false);
        return;
      }

      // 🔹 Case-insensitive filtering for user data
      const userStats = statsData.filter(
        (stat) => stat.user?.toLowerCase() === decodedUser.toLowerCase()
      );

      const userProcesses = processData
        .filter((process) => process.user?.toLowerCase() === decodedUser.toLowerCase())
        .map((process) => ({
          processName: process.processName || "Unknown Process",
          cpuUsage: process.cpuUsage || 0,
          memoryUsage: process.memoryUsage || 0,
        }));

      setStatsHistory((prevHistory) =>
        [...prevHistory, ...userStats].slice(-50)
      );
      setUserProcesses(userProcesses);

      setLoading(false);
      setProcessLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setProcessLoading(false);
    }
  }, [decodedUser, API_BASE_URL]);

  useEffect(() => {
    if (!decodedUser) return;

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, [decodedUser, fetchData]);

  const latestStats =
    statsHistory.length > 0 ? statsHistory[statsHistory.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
        {decodedUser}'s Live System Statistics
      </h2>

      {/* Data Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-gray-200 uppercase text-sm tracking-wider">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">IP Address</th>
              <th className="py-3 px-6 text-center">CPU Usage</th>
              <th className="py-3 px-6 text-center">Memory Used</th>
              <th className="py-3 px-6 text-center">Disk Used</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  Loading data...
                </td>
              </tr>
            ) : !latestStats ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-red-400">
                  No Data Available
                </td>
              </tr>
            ) : (
              <tr className="border-t border-gray-700 even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600 transition">
                <td className="py-3 px-6">{latestStats.id || "N/A"}</td>
                <td className="py-3 px-6">{latestStats.user || "N/A"}</td>
                <td className="py-3 px-6">{latestStats.ipAddress || "N/A"}</td>
                <td className="py-3 px-6 text-center">
                  {latestStats.cpuUsage
                    ? latestStats.cpuUsage.toFixed(2) + "%"
                    : "N/A"}
                </td>
                <td className="py-3 px-6 text-center">
                  {latestStats.memoryUsed && latestStats.memoryTotal
                    ? `${latestStats.memoryUsed.toFixed(3)} GB / ${latestStats.memoryTotal.toFixed(3)} GB`
                    : "N/A"}
                </td>
                <td className="py-3 px-6 text-center">
                  {latestStats.diskUsed && latestStats.diskTotal
                    ? `${latestStats.diskUsed.toFixed(3)} GB / ${latestStats.diskTotal.toFixed(3)} GB`
                    : "N/A"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Chart with Historical Data */}
      <StatsChart data={statsHistory} hideXAxisLabels />

      {/* User Processes List */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-green-400 mb-4">
          {decodedUser}'s Active Processes
        </h3>
        {processLoading ? (
          <p className="text-gray-400">Loading processes...</p>
        ) : userProcesses.length === 0 ? (
          <p className="text-red-400">No active processes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-700 text-gray-200 uppercase text-sm tracking-wider">
                <tr>
                  <th className="py-3 px-6 text-left">Process Name</th>
                  <th className="py-3 px-6 text-center">CPU Usage (%)</th>
                  <th className="py-3 px-6 text-center">Memory Usage (MB)</th>
                </tr>
              </thead>
              <tbody>
                {userProcesses.map((process, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-700 even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600 transition"
                  >
                    <td className="py-3 px-6">{process.processName}</td>
                    <td className="py-3 px-6 text-center">
                      {process.cpuUsage.toFixed(2)}%
                    </td>
                    <td className="py-3 px-6 text-center">
                      {process.memoryUsage.toFixed(2)} MB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
