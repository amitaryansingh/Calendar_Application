import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090/calendarapp", // Base URL for the API
  withCredentials: true,
});

// Add Authorization token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export API functions for authentication
export const signUp = (data) => API.post("/auth/signup", data);
export const signIn = (data) => API.post("/auth/signin", data);
export const signOut = () => API.post("/auth/signout");
export const getUserRoleByEmail = (email) => API.get(`/auth/users/role?email=${email}`);
export const refreshToken = () => API.post("/auth/refresh");

// Admin API functions for managing companies
export const getCompaniesByUserId = (userId) => API.get(`/admin/companies/user/${userId}`);
export const getAllCompanies = () => API.get("/admin/companies");
export const getCompanyById = (id) => API.get(`/admin/companies/${id}`);
export const createCompany = (data) => API.post("/admin/companies", data);
export const updateCompany = (id, data) => API.put(`/admin/companies/${id}`, data);
export const deleteCompany = (id) => API.delete(`/admin/companies/${id}`);
export const assignUserToCompany = (companyId, userId) =>
  API.post(`/admin/companies/${companyId}/assignUser/${userId}`);
export const removeUserFromCompany = (companyId, userId) =>
  API.delete(`/admin/companies/${companyId}/removeUser/${userId}`);
export const assignMultipleUsersToCompany = (companyId, userIds) =>
  API.post(`/admin/companies/${companyId}/assignUsers`, userIds);

// Admin API functions for managing users
export const getAllUsers = () => API.get("/admin/users");
export const getUserById = (id) => API.get(`/admin/users/${id}`);
export const createUser = (data) => API.post("/admin/users", data);
export const updateUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const assignCompanyToUser = (userId, companyId) =>
  API.post(`/admin/users/${userId}/assignCompany/${companyId}`);
export const removeCompanyFromUser = (userId, companyId) =>
  API.delete(`/admin/users/${userId}/removeCompany/${companyId}`);
export const assignMultipleCompaniesToUser = (userId, companyIds) =>
  API.post(`/admin/users/${userId}/assignCompanies`, companyIds);
export const getUserCompanies = (userId) => API.get(`/admin/users/${userId}/companies`);
export const getUserMessagesByCompany = (userId, companyId) =>
  API.get(`/admin/users/${userId}/companies/${companyId}/messages`);

// Admin API functions for managing messages
export const getAllMessages = () => API.get("/admin/messages");
export const getMessageById = (id) => API.get(`/admin/messages/${id}`);
export const createMessage = (data) => API.post("/admin/messages", data);
export const updateMessage = (id, data) => API.put(`/admin/messages/${id}`, data);
export const deleteMessage = (id) => API.delete(`/admin/messages/${id}`);
export const getMessagesByUserId = (userId) => API.get(`/admin/messages/user/${userId}`);
export const getMessagesByCompanyId = (companyId) => API.get(`/admin/messages/company/${companyId}`);
export const getMessagesByPriorityLevel = (priorityLevel) =>
  API.get(`/admin/messages/priority`, { params: { priorityLevel } });
export const getMessagesBySeenStatus = (seen) => API.get(`/admin/messages/seen`, { params: { seen } });
export const getMessagesWithinDateRange = (startDate, endDate) =>
  API.get(`/admin/messages/date-range`, { params: { startDate, endDate } });
export const getMessagesNotSeenByUserForCompany = (userId, companyId) =>
  API.get(`/admin/messages/user-company-not-seen`, { params: { userId, companyId } });

export default API;
