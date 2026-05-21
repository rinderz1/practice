import { apiClient } from "./apiClient";

export const conferencesApi = {
  getAll: () => apiClient.get("/conferences"),
  getById: (id) => apiClient.get(`/conferences/${id}`),
  create: (userId, data) => apiClient.post(`/conferences?userId=${userId}`, data),
  update: (id, data) => apiClient.put(`/conferences/${id}`, data),
  delete: (id) => apiClient.delete(`/conferences/${id}`),
};
