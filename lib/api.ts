import axios, { AxiosError, AxiosResponse } from "axios";
import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

// Create axios instance for general API
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 30000,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token/cookies
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Better Auth uses cookies by default, but we can also check for session
      const session = await authClient.getSession();
      if (session?.data?.session) {
        // Add session info to headers if needed
        config.headers["X-Session-ID"] = session.data.session.id;
      }
      return config;
    } catch (error) {
      console.warn("Failed to get session for request:", error);
      return config;
    }
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response, request } = error;

    // Network error
    if (!response) {
      console.error("Network error:", error.message);
      throw new Error("Network error. Please check your connection.");
    }

    // Server error
    const status = response.status;
    const data = response.data as unknown;

    switch (status) {
      case 401:
        console.warn("Unauthorized request:", request.url);
        // Better Auth will handle redirect automatically
        throw new Error("Authentication required. Please sign in.");

      case 403:
        console.warn("Forbidden request:", request.url);
        throw new Error("Access forbidden. Insufficient permissions.");

      case 404:
        console.warn("Resource not found:", request.url);
        throw new Error(data?.message || "Resource not found.");

      case 422:
        console.warn("Validation error:", data);
        throw new Error(data?.message || "Invalid data provided.");

      case 429:
        console.warn("Rate limit exceeded:", request.url);
        throw new Error("Too many requests. Please try again later.");

      case 500:
      case 502:
      case 503:
      case 504:
        console.error("Server error:", status, data);
        throw new Error(data?.message || "Server error. Please try again.");

      default:
        console.error("API error:", status, data);
        throw new Error(data?.message || `Request failed with status ${status}`);
    }
  },
);

export default apiClient;
