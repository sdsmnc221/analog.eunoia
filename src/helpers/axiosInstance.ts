import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
