"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function StatsChart({ data, darkMode }) {
  if (!data || data.length < 1) return <p className="text-gray-400">Loading charts...</p>;

  const processedData = data.map(stat => ({
    cpuUsage: stat.cpuUsage,
    memoryUsed: parseFloat(stat.memoryUsed.toFixed(3)),
    memoryTotal: parseFloat(stat.memoryTotal.toFixed(3)),
    diskUsed: parseFloat(stat.diskUsed.toFixed(3)),
    diskTotal: parseFloat(stat.diskTotal.toFixed(3)),
  }));

  const latestStats = processedData[processedData.length - 1];
  const memoryLimit = latestStats.memoryTotal || 10.000;
  const diskLimit = latestStats.diskTotal || 50.000;

  // **Dynamic Theme Based on Dark Mode**
  const theme = darkMode
    ? {
        background: "bg-gray-800",
        border: "border-gray-700",
        text: "text-gray-300",
        tooltipBg: "#222",
        tooltipBorder: "#444",
        axisColor: "#ddd",
      }
    : {
        background: "bg-gray-100",
        border: "border-gray-300",
        text: "text-gray-800",
        tooltipBg: "#f9f9f9",
        tooltipBorder: "#ccc",
        axisColor: "#333",
      };

  const gradients = {
    cpu: { start: "#ff4d4d", stop: "#ff9999" },
    memory: { start: "#4CAF50", stop: "#81C784" },
    disk: { start: "#ffa500", stop: "#ffcc80" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ChartCard title="CPU Usage (%)" data={processedData} dataKey="cpuUsage" gradientId="cpuGradient" color={gradients.cpu} yAxisDomain={[0, 100]} theme={theme} />
      <ChartCard title="Memory Used (GB)" data={processedData} dataKey="memoryUsed" gradientId="memoryGradient" color={gradients.memory} yAxisDomain={[0, memoryLimit]} theme={theme} />
      <ChartCard title="Disk Used (GB)" data={processedData} dataKey="diskUsed" gradientId="diskGradient" color={gradients.disk} yAxisDomain={[0, diskLimit]} theme={theme} />
    </div>
  );
}

// **Reusable Chart Component**
const ChartCard = ({ title, data, dataKey, gradientId, color, yAxisDomain, theme }) => (
  <div className={`${theme.background} p-4 rounded-lg shadow-lg ${theme.border} hover:shadow-xl transition-shadow duration-300`}>
    <h3 className={`text-lg font-semibold text-center ${theme.text} mb-3`}>{title}</h3>
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color.start} stopOpacity={0.9} />
            <stop offset="95%" stopColor={color.stop} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke={theme.border} />
        <XAxis tick={false} />
        <YAxis domain={yAxisDomain} tick={{ fontSize: 12, fill: theme.axisColor }} />
        <Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, borderColor: theme.tooltipBorder }} />
        <Area type="monotone" dataKey={dataKey} stroke={color.start} fill={`url(#${gradientId})`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
