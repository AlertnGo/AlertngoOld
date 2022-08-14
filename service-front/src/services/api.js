import axios from "axios";
const url = "http://localhost:5000/api";

const api = axios.create({
  baseURL: url,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
