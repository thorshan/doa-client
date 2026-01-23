import apiClient from "./apiClient";

export const chapterApi = {
  getAllChapter: () => apiClient.get("/chapters/admin"),
  createChapter: (data) => apiClient.post(`/chapters`, data),
  getChapter: (id) => apiClient.get(`/chapters/${id}`),
  updateChapter: (id,data) => apiClient.patch(`/chapters/${id}`, data),
  deleteChapter: (id) => apiClient.delete(`/chapters/${id}`),
};
