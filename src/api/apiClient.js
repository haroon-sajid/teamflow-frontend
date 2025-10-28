// src/api/apiClient.js
import axios from "axios";

import { API_URL } from "../config/apiConfig";
console.log(API_URL);

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
