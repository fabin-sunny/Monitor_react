import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiMenu, FiHome, FiUser, FiFileText, FiTable } from "react-icons/fi";

export default function Sidebar({ isOpen, setIsOpen, setActivePage }) {
  const { user } = useParams();
  const decodedUser = decodeURIComponent(user);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed left-0 top-20 transition-all duration-300 z-40
        ${isOpen ? "w-64" : "w-20"} h-[calc(100vh-4rem)]
        ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} shadow-lg flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-200">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-200 transition"
        >
          <FiMenu size={28} /> {/* Increased icon size */}
        </button>
        {isOpen && (
          <span className="text-xl font-semibold ml-3 truncate">
            {decodedUser} {/* Increased font size */}
          </span>
        )}
      </div>

      {/* Sidebar Items */}
      <nav className="flex-1 mt-2">
        <SidebarItem icon={<FiHome size={19} />} label="Dashboard" isOpen={isOpen} onClick={() => setActivePage("Dashboard")} />
        <SidebarItem icon={<FiTable size={19} />} label="Active Processes" isOpen={isOpen} onClick={() => setActivePage("Active Processes")} />
        <SidebarItem icon={<FiFileText size={19} />} label="Run Command" isOpen={isOpen} onClick={() => setActivePage("Run Command")} />
      </nav>
    </div>
  );
}

// Sidebar Item Component
const SidebarItem = ({ icon, label, isOpen, onClick }) => (
  <div 
    className="flex items-center space-x-4 px-4 py-4 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition rounded-md mx-2"
    onClick={onClick}
  >
    {icon}
    {isOpen && <span className="text-lg font-medium">{label}</span>} {/* Increased text size */}
  </div>
);
