import { apiClient } from "./apiClient";

export const assignmentsApi = {
  create: (data) => apiClient.post("/assignments", data),
  getByReviewer: (reviewerId) => apiClient.get(`/assignments/reviewer/${reviewerId}`),
  getByPaper: (paperId) => apiClient.get(`/assignments/paper/${paperId}`),
};
