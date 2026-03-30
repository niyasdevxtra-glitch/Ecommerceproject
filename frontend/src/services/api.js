import axios from "axios";

export const API_BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:3001";

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials:true
});

// Add a request interceptor to include the token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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

export default API;