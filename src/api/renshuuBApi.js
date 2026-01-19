import apiClient from "./apiClient";

export const renshuuBApi = {
  getAllRenshuuB: () => apiClient.get("/renshuuB"),
  createRenshuuB: (data) => apiClient.post(`/renshuuB`, data),
  getRenshuuB: (id) => apiClient.get(`/renshuuB/${id}`),
  updateRenshuuB: (id,data) => apiClient.patch(`/renshuuB/${id}`, data),
  deleteRenshuuB: (id) => apiClient.delete(`/renshuuB/${id}`),
};
