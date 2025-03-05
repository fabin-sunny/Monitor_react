import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api", // Replace with your backend URL
    withCredentials: true,
});

export const fetchStats = async () => {
    try {
        const response = await API.get("/stats");
        return response.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        return [];
    }
};
