import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090/calendarapp", // Spring Boot base URL
  withCredentials: true, // Include cookies if needed
});

// Add Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export API functions
export const signUp = (data) => API.post("/auth/signup", data);
export const signIn = (data) => API.post("/auth/signin", data);
export const getUserRoleByEmail = (email) =>
  API.get(`/auth/users/role?email=${email}`); // Ensure this endpoint is correct
export const refreshToken = (data) => API.post("/auth/refresh", data);

export default API;
