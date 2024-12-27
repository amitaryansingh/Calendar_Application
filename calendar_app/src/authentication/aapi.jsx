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
// Admin API functions for managing companies and users
export const getAllCompanies = () => API.get("/admin/companies");
export const createCompany = (data) => API.post("/admin/companies", data);
export const deleteCompany = (id) => API.delete(`/admin/companies/${id}`);
export const getAllUsers = () => API.get("/admin/users");
export const createUser = (data) => API.post("/admin/users", data);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export default API;
