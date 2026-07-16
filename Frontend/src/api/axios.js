import axios from "axios";

// Backend base URL. Change VITE_API_URL in a .env file if backend runs elsewhere.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token (saved at login) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, log the user out and send them back to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // Log full details to the browser console so real failures (wrong
    // backend URL, CORS, server down, validation errors) are easy to spot
    // instead of only seeing a generic "failed to load" message in the UI.
    if (error.response) {
      console.error(
        `[API] ${error.config?.method?.toUpperCase()} ${error.config?.url} -> ${error.response.status}`,
        error.response.data
      );
    } else if (error.request) {
      console.error(
        `[API] No response received for ${error.config?.method?.toUpperCase()} ${error.config?.url}. ` +
          `Is the backend running at ${baseURL}? Is CORS blocking it? Check the Network tab.`,
        error.message
      );
    } else {
      console.error("[API] Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper to pull a readable message out of an error response
export const getErrorMessage = (err, fallback = "Something went wrong") => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.request && !err?.response) {
    return "Could not reach the server. Check that the backend is running and the API URL is correct.";
  }
  return fallback;
};

export default api;
