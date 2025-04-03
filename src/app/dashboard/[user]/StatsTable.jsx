import { FiCpu, FiHardDrive, FiUser, FiWifi } from "react-icons/fi";

export default function StatsTable({ statsHistory, loading, darkMode }) {
  const latestStats = statsHistory.length > 0 ? statsHistory[statsHistory.length - 1] : null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {loading ? (
        <div className="col-span-full text-center text-gray-400 text-lg font-medium">Loading data...</div>
      ) : !latestStats ? (
        <div className="col-span-full text-center text-red-500 text-lg font-medium">No Data Available</div>
      ) : (
        <>
          <StatCard
            icon={<FiUser size={22} className="text-blue-500" />}
            title="User"
            value={latestStats.user || "N/A"}
            darkMode={darkMode}
          />
          <StatCard
            icon={<FiWifi size={22} className="text-purple-500" />}
            title="IP Address"
            value={latestStats.ipAddress || "N/A"}
            darkMode={darkMode}
          />
          <StatCard
            icon={<FiCpu size={22} className="text-red-500" />}
            title="CPU Usage"
            value={latestStats.cpuUsage ? `${latestStats.cpuUsage.toFixed(2)}%` : "N/A"}
            darkMode={darkMode}
          />
          <StatCard
            icon={<FiHardDrive size={22} className="text-green-500" />}
            title="Memory Used"
            value={
              latestStats.memoryUsed && latestStats.memoryTotal
                ? `${latestStats.memoryUsed.toFixed(1)} GB / ${latestStats.memoryTotal.toFixed(1)} GB`
                : "N/A"
            }
            darkMode={darkMode}
          />
          <StatCard
            icon={<FiHardDrive size={22} className="text-orange-500" />}
            title="Disk Used"
            value={
              latestStats.diskUsed && latestStats.diskTotal
                ? `${latestStats.diskUsed.toFixed(1)} GB / ${latestStats.diskTotal.toFixed(1)} GB`
                : "N/A"
            }
            darkMode={darkMode}
          />
        </>
      )}
    </div>
  );
}

// ✅ Professional, Clean Stat Card Component
const StatCard = ({ icon, title, value, darkMode }) => (
  <div
    className={`p-4 rounded-lg shadow-sm flex flex-col items-center text-center space-y-2
      transition-all duration-300
      ${darkMode ? "bg-gray-800 text-white shadow-gray-700" : "bg-white text-gray-900 shadow"}
    `}
  >
    <div className="text-xl">{icon}</div>
    <div className="text-sm font-medium tracking-wide">{title}</div>
    <div className="text-lg font-semibold">{value}</div>
  </div>
);
