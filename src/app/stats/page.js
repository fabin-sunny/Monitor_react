import StatsChart from "@/components/StatsChart";

import { useState, useEffect } from "react";
import { fetchStats } from "@/utils/api";



export default function SystemStats() {
  const [stats, setStats] = useState([]);
  useEffect(() => {
    console.log("Component Mounted!"); // Check if component renders
    
    const fetchData = async () => {
        console.log("Fetching Data...");
        try {
            const data = await fetchStats();
            console.log("Data Received:", data); // Log full response
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    
    return () => clearInterval(interval);
}, []);


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-center text-2xl font-bold text-blue-600 mb-4">Live System Statistics</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">User</th>
              <th className="p-2">CPU Usage</th>
              <th className="p-2">Memory Used</th>
              <th className="p-2">Disk Used</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((stat) => (
                <tr key={stat.id} className="text-center border-t">
                  <td className="p-2">{stat.id}</td>
                  <td className="p-2">{stat.user || "N/A"}</td>
                  <td className="p-2">{stat.cpuUsage.toFixed(2)}%</td>
                  <td className="p-2">{stat.memoryUsed.toFixed(2)} GB / {stat.memoryTotal.toFixed(2)} GB</td>
                  <td className="p-2">{stat.diskUsed.toFixed(2)} GB / {stat.diskTotal.toFixed(2)} GB</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-red-500 text-center p-3">No Data Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Display Graphs Below the Table */}
      <StatsChart />
    </div>
  );
}
