import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  withCredentials: true,
});

// Reads a cookie value by name from document.cookie
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

// Attaches the CSRF token from the cookie as a custom header on every request
// Server compares this header against the cookie value (double-submit pattern)
api.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrfToken");
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

export default api;
