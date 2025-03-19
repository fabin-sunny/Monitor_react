"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import StatsChart from "@components/StatsChart";

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useParams() || {};
  const decodedUser = user ? decodeURIComponent(user) : null; // Ensure it's valid

  const [statsHistory, setStatsHistory] = useState([]);
  const [userProcesses, setUserProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processLoading, setProcessLoading] = useState(true);
  const [command, setCommand] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [executing, setExecuting] = useState(false);

  // Ensure user is authenticated
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    }
  }, [router]);

  // ✅ Set API Base URL correctly for local and remote use
  const API_BASE_URL =
    typeof window !== "undefined"
      ? `http://${window.location.hostname}:9090`
      : "http://localhost:9090";

  // ✅ Fetch system stats and processes
  const fetchData = useCallback(async () => {
    if (!decodedUser) return;

    try {
      console.log(`Fetching data for user: ${decodedUser}`);

      const [statsResponse, processResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/stats`),
        fetch(`${API_BASE_URL}/api/processes`),
      ]);

      if (!statsResponse.ok || !processResponse.ok) {
        throw new Error("API request failed");
      }

      const [statsData, processData] = await Promise.all([
        statsResponse.json(),
        processResponse.json(),
      ]);

      if (!Array.isArray(statsData) || !Array.isArray(processData)) {
        console.error("Invalid API response format.");
        setLoading(false);
        setProcessLoading(false);
        return;
      }

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
      fetchCommandOutput(); // Periodically check for command output
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
  
      setTimeout(fetchCommandOutput, 3000); // Fetch output after delay
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
  

  const latestStats =
    statsHistory.length > 0 ? statsHistory[statsHistory.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
        {decodedUser}'s Live System Statistics
      </h2>

      {/* ✅ Command Execution Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowCommandModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Run Command
        </button>
      </div>

      {/* ✅ Command Execution Modal */}
      {showCommandModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-white mb-4">
              Execute Command
            </h3>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command..."
              className="w-full p-2 mb-4 border rounded bg-gray-700 text-white"
            />
            <div className="flex justify-between">
              <button
                onClick={sendCommand}
                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${
                  executing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={executing}
              >
                {executing ? "Executing..." : "Run"}
              </button>
              <button
                onClick={() => setShowCommandModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>

            {/* ✅ Command Output */}
            {commandOutput && (
              <div className="mt-4 p-3 bg-gray-900 text-green-400 rounded">
                <strong>Output:</strong>
                <pre className="whitespace-pre-wrap">{commandOutput}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
