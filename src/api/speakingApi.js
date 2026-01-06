import apiClient from "./apiClient";

export const speakingApi = {
  getAllSpeaking: () => apiClient.get("/speakings"),
  createSpeaking: (data) => apiClient.post(`/speakings`, data),
  getSpeaking: (id) => apiClient.get(`/speakings/${id}`),
  updateSpeaking: (id,data) => apiClient.put(`/speakings/${id}`, data),
  deleteSpeaking: (id) => apiClient.delete(`/speakings/${id}`),
};
