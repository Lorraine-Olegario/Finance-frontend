import apiClient from "./api";

export default {
  // Login
  login(email, password) {
    return apiClient.post("/auth/login", { email, password });
  },

  // Logout
  logout() {
    return apiClient.post("/auth/logout");
  },

  // Get current user
  me() {
    return apiClient.get("/auth/me");
  },

  // Register
  register(userData) {
    return apiClient.post("/auth/register", userData);
  },
};
