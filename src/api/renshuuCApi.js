import apiClient from "./apiClient";

export const renshuuCApi = {
  getAllRenshuuC: () => apiClient.get("/renshuuC"),
  createRenshuuC: (data) => apiClient.post(`/renshuuC`, data),
  getRenshuuC: (id) => apiClient.get(`/renshuuC/${id}`),
  updateRenshuuC: (id,data) => apiClient.patch(`/renshuuC/${id}`, data),
  deleteRenshuuC: (id) => apiClient.delete(`/renshuuC/${id}`),
};
