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
  const [command, setCommand] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


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

  // ✅ Function to send command to backend
  const sendCommand = async () => {
    if (!command.trim() || !decodedUser) {
      console.error("System and command must be provided.");
      return;
    }
  
    setExecuting(true);
    setCommandOutput(""); // Clear previous output
  
    try {
      console.log(`Sending command: "${command}" for system: ${decodedUser}`);
  
      const response = await fetch(`${API_BASE_URL}/api/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: decodedUser, command }), // Use "system" instead of "user"
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to execute command: ${errorMessage}`);
      }
  
      setTimeout(fetchCommandOutput, 1000); // Fetch output after delay
    } catch (error) {
      console.error("Command execution failed:", error);
    } finally {
      setExecuting(false);
    }
  };
  

  // ✅ Function to fetch command output
  const fetchCommandOutput = async () => {
    if (!decodedUser) return;
  
    try {
      console.log(`Fetching command output for system: ${decodedUser}`);
  
      const response = await fetch(
        `${API_BASE_URL}/api/command/output?system=${encodeURIComponent(decodedUser)}`
      );
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch command output: ${errorMessage}`);
      }
  
      const data = await response.text();
      setCommandOutput(data);
    } catch (error) {
      console.error("Error fetching command output:", error);
    }
  };
  
  const refreshCommandOutput = async () => {
    if (!decodedUser) return;
  
    setRefreshing(true); // Start animation
  
    try {
      console.log(`Refreshing command output for system: ${decodedUser}`);
  
      const response = await fetch(
        `${API_BASE_URL}/api/command/output?system=${encodeURIComponent(decodedUser)}`
      );
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch command output: ${errorMessage}`);
      }
  
      const data = await response.text();
  
      // Enforce a 3-second refresh animation before updating state
      setTimeout(() => {
        setCommandOutput(data);
        setRefreshing(false);
      }, 3000);
    } catch (error) {
      console.error("Error refreshing command output:", error);
      setRefreshing(false);
    }
  };

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
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-2xl font-semibold text-green-400">
      {decodedUser}'s Active Processes
    </h3>
    <button 
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      onClick={() => setShowCommandModal(true)}
    >
      Run Command
    </button>
  </div>

  {showCommandModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-6">
    <div className="bg-gray-900/90 p-8 rounded-xl shadow-2xl w-[1000px] border border-gray-700">
      <h3 className="text-3xl font-bold text-white text-center mb-6">
        Execute Command
      </h3>

      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendCommand()} // ⏎ Press Enter to Send
        placeholder="Enter command..."
        className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

{commandOutput && (
  <div className="mt-6 p-4 bg-gray-900 text-green-400 rounded-lg border border-gray-700 h-96 overflow-y-auto text-lg whitespace-pre-wrap w-full relative">
    {/* Header with Refresh Button */}
    <div className="flex justify-between items-center mb-2">
      <strong>Output:</strong>
      <button
        onClick={refreshCommandOutput}
        className={`text-gray-400 hover:text-white transition p-1 rounded-md bg-gray-700 hover:bg-gray-600 flex items-center justify-center ${
          refreshing ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Refresh Output"
        disabled={refreshing}
      >
        {refreshing ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-7.95 9H4z"
            ></path>
          </svg>
        ) : (
          "🔄"
        )}
      </button>
    </div>

    {/* Command Output with Overlay Animation */}
    <div className="relative">
      {refreshing && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <svg
            className="animate-spin h-6 w-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-7.95 9H4z"
            ></path>
          </svg>
        </div>
      )}
      <pre className={`${refreshing ? "opacity-50" : ""}`}>{commandOutput}</pre>
    </div>
  </div>
)}

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={sendCommand}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md text-base transition ${
            executing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={executing}
        >
          {executing ? "Executing..." : "Run"}
        </button>
        <button
          onClick={() => setShowCommandModal(false)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded-md text-base transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


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
