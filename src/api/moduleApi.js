import apiClient from "./apiClient";

export const moduleApi = {
  getAllModules: () => apiClient.get("/modules"),
  createModule: (data) => apiClient.post(`/modules`, data),
  updateModule: (id, data) => apiClient.put(`/modules/${id}`, data),
  deleteModule: (id) => apiClient.delete(`/modules/${id}`),
  getModule: (id) => apiClient.get(`/modules/${id}`),
};
