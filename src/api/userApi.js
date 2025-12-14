import apiClient from "./apiClient";

export const userApi = {
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/update/${id}`, data),
};
