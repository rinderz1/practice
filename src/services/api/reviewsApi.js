import { apiClient } from "./apiClient";

export const reviewsApi = {
  create: (data) => apiClient.post("/reviews", data),
  submit: (data) => apiClient.post("/reviews", data),
  getByPaper: (paperId) => apiClient.get(`/reviews/paper/${paperId}`),
};
