import apiClient from "./apiClient";

export const cardApi = {
  getAllCards: () => apiClient.get("/cards"),
  createCard: (data) => apiClient.post("/cards", data),
  getCard: (id) => apiClient.get(`/cards/${id}`),
  updateCard: (id, data) => apiClient.put(`/cards/${id}`, data),
  deleteCard: (id) => apiClient.delete(`/cards/${id}`),
};
