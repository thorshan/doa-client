import apiClient from "./apiClient";

export const kanjiApi = {
  getAllKanji: () => apiClient.get("/kanji"),
  createKanji: (data) => apiClient.post(`/kanji`, data),
  getKanji: (id) => apiClient.get(`/kanji/${id}`),
  updateKanji: (id,data) => apiClient.put(`/kanji/${id}`, data),
  deleteKanji: (id) => apiClient.delete(`/kanji/${id}`),
};
