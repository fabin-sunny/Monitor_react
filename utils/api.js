import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api", // Your backend URL
    withCredentials: true,
});

// Fetch system stats
export const fetchStats = async () => {
    try {
        const response = await API.get("/stats");
        return response.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        return [];
    }
};

// Fetch active processes
export const fetchActiveProcesses = async () => {
    try {
        const response = await API.get("/processes");
        return response.data;
    } catch (error) {
        console.error("Error fetching active processes:", error);
        return [];
    }
};

// Send command to execute
export const sendCommand = async (command) => {
    try {
        const response = await API.post("/execute", { command });
        return response.data;
    } catch (error) {
        console.error("Error sending command:", error);
        return null;
    }
};
