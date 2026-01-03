import apiClient from "./apiClient";

export const levelApi = {
  getAllLevel: () => apiClient.get("/levels"),
  createLevel: (data) => apiClient.post(`/levels`, data),
  updateLevel: (id, data) => apiClient.put(`/levels/${id}`, data),
  deleteLevel: (id) => apiClient.delete(`/levels/${id}`),
};
