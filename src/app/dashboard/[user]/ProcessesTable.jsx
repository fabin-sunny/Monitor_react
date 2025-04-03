export default function ProcessesTable({ userProcesses, processLoading, darkMode }) {
    // **Dynamic Theme Based on Dark Mode**
    const theme = darkMode
      ? {
          background: "bg-gray-800",
          border: "border-gray-700",
          text: "text-gray-300",
          headerBg: "bg-gray-700",
          hoverBg: "hover:bg-gray-600",
          loadingText: "text-gray-400",
          emptyText: "text-red-400",
        }
      : {
          background: "bg-gray-100",
          border: "border-gray-300",
          text: "text-gray-800",
          headerBg: "bg-gray-300",
          hoverBg: "hover:bg-gray-200",
          loadingText: "text-gray-600",
          emptyText: "text-red-600",
        };
  
    return processLoading ? (
      <p className={`${theme.loadingText}`}>Loading processes...</p>
    ) : userProcesses.length === 0 ? (
      <p className={`${theme.emptyText}`}>No active processes found.</p>
    ) : (
      <div className="overflow-x-auto mt-4">
        <table className={`min-w-full ${theme.background} shadow-lg rounded-lg overflow-hidden ${theme.border}`}>
          <thead className={`${theme.headerBg} ${theme.text} uppercase text-sm tracking-wider`}>
            <tr>
              <th className="py-3 px-6 text-left">Process Name</th>
              <th className="py-3 px-6 text-center">CPU Usage (%)</th>
              <th className="py-3 px-6 text-center">Memory Usage (MB)</th>
            </tr>
          </thead>
          <tbody>
            {userProcesses.map((process, index) => (
              <tr key={index} className={`border-t ${theme.border} ${theme.hoverBg}`}>
                <td className="py-3 px-6">{process.processName}</td>
                <td className="py-3 px-6 text-center">{process.cpuUsage.toFixed(2)}%</td>
                <td className="py-3 px-6 text-center">{process.memoryUsage.toFixed(2)} MB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  