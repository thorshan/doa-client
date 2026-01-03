import apiClient from "./apiClient";

export const examApi = {
  getAllExams: () => apiClient.get("/exams"),
  createExam: (data) => apiClient.post(`/exams`, data),
  getExam: (id) => apiClient.get(`/exams/${id}`),
  getExamByLecture: (id) => apiClient.get(`/exams/lectures/${id}`),
  updateExam: (id,data) => apiClient.put(`/exams/${id}`, data),
  deleteExam: (id) => apiClient.delete(`/exams/${id}`),
};
