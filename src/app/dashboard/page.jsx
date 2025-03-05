"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsChart from "../../../components/StatsChart";

export default function Dashboard() {
  const router = useRouter();
  const [statsHistory, setStatsHistory] = useState([]); // Store historical data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/stats");
      if (!response.ok) throw new Error("Failed to fetch data");

      const newData = await response.json();

      if (!Array.isArray(newData)) {
        console.error("Invalid data format: Expected an array", newData);
        return;
      }

      setStatsHistory((prevHistory) => [...prevHistory, ...newData].slice(-50)); // Store latest 50 records
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const latestStats = statsHistory.length > 0 ? statsHistory[statsHistory.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
        Live System Statistics
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
                  {latestStats.cpuUsage ? latestStats.cpuUsage.toFixed(2) + "%" : "N/A"}
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
    </div>
  );
}