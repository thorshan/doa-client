import apiClient from "./apiClient";

export const vocabApi = {
  getAllVocab: () => apiClient.get("/vocabularies"),
  createVocab: (data) => apiClient.post(`/vocabularies`, data),
  updateVocab: (id, data) => apiClient.put(`/vocabularies/${id}`, data),
  deleteVocab: (id) => apiClient.delete(`/vocabularies/${id}`),
};
