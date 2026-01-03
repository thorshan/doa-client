import apiClient from "./apiClient";

export const grammarApi = {
  getAllGrammar: () => apiClient.get("/grammars"),
  createGrammar: (data) => apiClient.post(`/grammars`, data),
  getGrammar: (id) => apiClient.get(`/grammars/${id}`),
  updateGrammar: (id,data) => apiClient.put(`/grammars/${id}`, data),
  deleteGrammar: (id) => apiClient.delete(`/grammars/${id}`),
};
