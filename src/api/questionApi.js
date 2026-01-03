import apiClient from "./apiClient";

export const questionApi = {
  getAllQuestions: () => apiClient.get("/questions"),
  createQuestion: (data) => apiClient.post(`/questions`, data),
  updateQuestion: (id, data) => apiClient.put(`/questions/${id}`, data),
  deleteQuestion: (id) => apiClient.delete(`/questions/${id}`),
  getQuestion: (id) => apiClient.get(`/questions/${id}`),
};
