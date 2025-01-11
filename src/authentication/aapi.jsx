import axios from "axios";

const API = axios.create({
  baseURL: "https://api.calendarapp.me/calendarapp", // Base URL for the API
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

export const getUserIdByEmail = (email) => API.get(`/userReq/user/id`, { params: { email } });

export const markMessageAsSeen = (messageId, userId) => 
  API.put(`/userReq/messages/${messageId}/seen`, null, { params: { userId } });

export const getSeenStatusByMessageIDAndUserID = (messageId, userId) => 
  API.get(`/userReq/messages/seenstatus?messageId=${messageId}&userId=${userId}`);

export const updateSeenStatus = (messageId, userId, seen) =>
  API.put(`/userReq/messages/status?messageId=${messageId}&userId=${userId}&seen=${seen}`);

export const updateUserProfile = (id, userData) => API.put(`/userReq/editprofile/${id}`, userData);

// User profile and company-related functions
export const getUserProfile = (id) => API.get(`/userReq/profile/${id}`);

export const getUserCompaniesforuser = (userId) => API.get(`/users/${userId}/companies`);

export const getUnseenMessagesByUser = (userId) => API.get(`/userReq/messages/unseen/${userId}`);

export const getMessagesNotSeenByUserForCompanyforuser = (userId, companyId) => 
  API.get(`/userReq/messages/user-company-not-seen`, { params: { userId, companyId } });

export const getCompanyByCompanyIdForUser  = (id) => API.get(`/userReq/companies/${id}`);

export const getUserMessagesByCompanyForUser  = (userId, companyId) => 
  API.get(`/userReq/users/${userId}/companies/${companyId}/messages`);

export const getCompanyUsersForUser  = (companyId) => API.get(`/userReq/companies/${companyId}/users`);


export const getMessageByIdForUser  = (id) => API.get(`/userReq/messages/${id}`);


export const getMessagesByUserIdForUser  = (userId) => API.get(`/userReq/message/user/${userId}`);


export const getMessagesByCompanyIdForUser  = (companyId) => API.get(`/userReq/message/company/${companyId}`);


export const getMessagesByPriorityLevelForUser  = (priorityLevel) => 
  API.get(`/userReq/message/priority`, { params: { priorityLevel } });

export const getMessagesBySeenStatusForUser  = (seen) => 
  API.get(`/userReq/message/seen`, { params: { seen } });


export const getMessagesWithinDateRangeForUser  = (startDate, endDate) => 
  API.get(`/userReq/message/date-range`, { params: { startDate, endDate } });



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

// Assign users and a company to a message
export const assignUsersAndCompanyToMessage = (messageId, companyId, userIds) => {
  // Construct the request payload
  const payload = userIds?.length ? userIds : null; // Only include userIds if they are provided and not empty

  return API.post(`/admin/messages/${messageId}/assign`, payload, {
    params: {
      companyId: companyId || undefined, // Only include companyId if provided
    },
  });
};


export default API;
