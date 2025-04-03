"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CommandTerminal() {
  const router = useRouter();
  const { user } = useParams();
  const decodedUser = decodeURIComponent(user);
  
  const [command, setCommand] = useState("");
  const [outputHistory, setOutputHistory] = useState([]);
  const [executing, setExecuting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    }

    // Check theme mode
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, [router]);

  const API_BASE_URL =
    typeof window !== "undefined"
      ? `http://${window.location.hostname}:9090`
      : "http://localhost:9090";

  const executeCommand = async () => {
    if (!command.trim() || !decodedUser) return;

    setExecuting(true);
    setOutputHistory((prev) => [...prev, `$ ${command}`]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: decodedUser, command }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setTimeout(fetchCommandOutput, 1000);
    } catch (error) {
      setOutputHistory((prev) => [...prev, `Error: ${error.message}`]);
    } finally {
      setCommand("");
      setExecuting(false);
    }
  };

  const fetchCommandOutput = async () => {
    if (!decodedUser) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/command/output?system=${encodeURIComponent(decodedUser)}`
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.text();
      setOutputHistory((prev) => [...prev, data]);
    } catch (error) {
      setOutputHistory((prev) => [...prev, `Error: ${error.message}`]);
    }
  };

  const refreshCommandOutput = async () => {
    if (!decodedUser) return;

    setRefreshing(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/command/output?system=${encodeURIComponent(decodedUser)}`
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.text();

      setTimeout(() => {
        setOutputHistory((prev) => [...prev, data]);
        setRefreshing(false);
      }, 2000);
    } catch (error) {
      setOutputHistory((prev) => [...prev, `Error: ${error.message}`]);
      setRefreshing(false);
    }
  };

  return (
    <div
      className={`w-full h-[400px] p-4 rounded-lg border shadow-md transition ${
        isDarkMode ? "bg-gray-900 text-green-400 border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"
      }`}
    >
      <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? "text-green-300" : "text-gray-700"}`}>
        Command Terminal
      </h3>

      {/* Terminal Window */}
      <div className={`h-[300px] overflow-y-auto p-2 rounded border transition ${isDarkMode ? "bg-black border-gray-700" : "bg-white border-gray-300"}`}>
        {outputHistory.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>

      {/* Input Line */}
      <div className="flex items-center mt-2">
        <span className={`${isDarkMode ? "text-green-400" : "text-gray-600"}`}>$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && executeCommand()}
          placeholder="Type a command..."
          className={`ml-2 w-full bg-transparent focus:outline-none ${isDarkMode ? "text-green-400" : "text-gray-900"}`}
          disabled={executing}
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-7">
        <button
          onClick={executeCommand}
          className={`px-4 py-1 rounded-md text-sm font-bold transition ${
            executing
              ? "opacity-50 cursor-not-allowed"
              : isDarkMode
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-green-500 hover:bg-green-400 text-white"
          }`}
          disabled={executing}
        >
          {executing ? "Executing..." : "Run"}
        </button>
        <button
          onClick={refreshCommandOutput}
          className={`px-4 py-1 rounded-md text-sm font-bold transition ${
            refreshing
              ? "opacity-50 cursor-not-allowed"
              : isDarkMode
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-blue-500 hover:bg-blue-400 text-white"
          }`}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
}
