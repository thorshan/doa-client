import apiClient from "./apiClient";

export const renshuuAApi = {
  getAllRenshuuA: () => apiClient.get("/renshuuA"),
  createRenshuuA: (data) => apiClient.post(`/renshuuA`, data),
  getRenshuuA: (id) => apiClient.get(`/renshuuA/${id}`),
  updateRenshuuA: (id,data) => apiClient.patch(`/renshuuA/${id}`, data),
  deleteRenshuuA: (id) => apiClient.delete(`/renshuuA/${id}`),
};
