import apiClient from "./apiClient";

export const lessonApi = {
  getAllLesson: () => apiClient.get("/lessons"),
  createLesson: (data) => apiClient.post(`/lessons`, data),
  updateLesson: (id, data) => apiClient.put(`/lessons/${id}`, data),
  deleteLesson: (id) => apiClient.delete(`/lessons/${id}`),
  getLesson: (id) => apiClient.get(`/lessons/${id}`),
};
