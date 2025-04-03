"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import StatsTable from "./StatsTable";
import ProcessesTable from "./ProcessesTable";
import UserChart from "./UserChart";
import CommandModal from "./CommandModal";
import Sidebar from "./Sidebar";

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useParams();
  const decodedUser = decodeURIComponent(user);

  const [statsHistory, setStatsHistory] = useState([]);
  const [userProcesses, setUserProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processLoading, setProcessLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard"); // Track selected page

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/login"); // Redirect to login if not authenticated
    }

  }, [router]);
  
  useEffect(() => {

    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, [router]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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

      setStatsHistory((prevHistory) => [...prevHistory, ...userStats].slice(-50));
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
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [decodedUser, fetchData]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      
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
  <h1 className="text-3xl font-extrabold tracking-wide text-white">
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
      onClick={() => {
        localStorage.removeItem("isAuthenticated");
        router.push("/login");
      }}
      className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
    >
      Logout
    </button>
  </div>
</nav>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} setActivePage={setActivePage} darkMode={darkMode} />

        {/* Content Based on Active Page */}
        <div className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
          
          {activePage === "Dashboard" && (
            <>
              <h2 className={`text-2xl uppercase font-extrabold text-center mb-3 ${darkMode ? "text-white" : "text-black"}`}>
                Live System Statistics
              </h2>
              <StatsTable statsHistory={statsHistory} loading={loading} darkMode={darkMode} />
              <UserChart data={statsHistory} darkMode={darkMode} />
            </>
          )}

          {activePage === "Active Processes" && (
            <>
              <h3 className={`text-xl uppercase font-extrabold ${darkMode ? "text-white" : "text-black"}`}>
                Active Processes
              </h3>
              <ProcessesTable userProcesses={userProcesses} processLoading={processLoading} darkMode={darkMode} />
            </>
          )}

          {activePage === "Run Command" && (
            <CommandModal decodedUser={decodedUser} onClose={() => setActivePage("Dashboard")} />
          )}
          
        </div>
      </div>
    </div>
  );
}
