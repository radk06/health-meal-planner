import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api"
});

// Attach JWT from localStorage
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: simple error logging
axiosClient.interceptors.response.use(
  res => res,
  err => {
    console.error("API error:", err?.response || err);
    throw err;
  }
);

export default axiosClient;
