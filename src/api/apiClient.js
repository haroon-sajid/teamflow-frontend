// src/api/apiClient.js
import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_URL = import.meta.env.VITE_API_URL?.trim() || "https://teamflow-backend-1tt9.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // keep if you use cookies; else false
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});

export default apiClient;
