import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials:true
});

// Add a request interceptor to include the token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (token && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (userId && userId !== "undefined") {
            config.headers['x-user-id'] = userId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthenticated error - could redirect to login here if necessary
            console.warn("Unauthenticated request:", error);
        } else if (error.response && error.response.status >= 500) {
            console.error("Server API Error:", error);
        }
        return Promise.reject(error);
    }
);

export const getMediaUrl = (path) => {
  if (!path) return "";
  // 1. Remove the localhost prefix if it exists
  let cleanPath = path.toString().replace("http://localhost:3001", "");
  // 2. Remove leading slashes to prevent double slashes (e.g., //uploads)
  cleanPath = cleanPath.replace(/^\/+/, "");
  // 3. Prepend the API_BASE_URL
  return `${API_BASE_URL}/${cleanPath}`;
};

export default API;