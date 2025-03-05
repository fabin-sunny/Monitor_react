"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function StatsChart({ data }) {
  if (data.length < 1) return null; // Avoid errors if data is empty

  // Processed data with 3 decimal rounding
  const processedData = data.map(stat => ({
    cpuUsage: stat.cpuUsage,
    memoryUsed: parseFloat(stat.memoryUsed.toFixed(3)),
    memoryTotal: parseFloat(stat.memoryTotal.toFixed(3)), // Round upper limit
    diskUsed: parseFloat(stat.diskUsed.toFixed(3)),
    diskTotal: parseFloat(stat.diskTotal.toFixed(3)), // Round upper limit
  }));

  // Get the latest memoryTotal and diskTotal values
  const latestStats = processedData[processedData.length - 1];
  const memoryLimit = latestStats.memoryTotal ? parseFloat(latestStats.memoryTotal.toFixed(3)) : 10.000;
  const diskLimit = latestStats.diskTotal ? parseFloat(latestStats.diskTotal.toFixed(3)) : 50.000;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* CPU Usage Graph */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-center text-gray-300 mb-3">CPU Usage (%)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#444" />
            <XAxis tick={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#ddd" }} />
            <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
            <Area type="monotone" dataKey="cpuUsage" stroke="#ff4d4d" fill="url(#cpuGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Memory Usage Graph */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-center text-gray-300 mb-3">Memory Used (GB)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#444" />
            <XAxis tick={false} />
            <YAxis domain={[0, memoryLimit]} tick={{ fontSize: 12, fill: "#ddd" }} />
            <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
            <Area type="monotone" dataKey="memoryUsed" stroke="#4CAF50" fill="url(#memoryGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Disk Usage Graph */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-center text-gray-300 mb-3">Disk Used (GB)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="diskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffa500" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#ffa500" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#444" />
            <XAxis tick={false} />
            <YAxis domain={[0, diskLimit]} tick={{ fontSize: 12, fill: "#ddd" }} />
            <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
            <Area type="monotone" dataKey="diskUsed" stroke="#ffa500" fill="url(#diskGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
