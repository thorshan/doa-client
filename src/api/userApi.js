import apiClient from "./apiClient";

export const userApi = {
  getUserData: () => apiClient.get("/users/user"),
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/update/${id}`, data),
  updateUserLevel: (id, data) => apiClient.put(`/users/${id}/level`, data),
  sendOTP: (data) => apiClient.post(`/users/send-otp`, data),
  verifyOTP: (data) => apiClient.post(`/users/verify-otp`, data),
};
