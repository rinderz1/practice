import { apiClient } from "./apiClient";

export const papersApi = {
  getAll: () => apiClient.get("/papers"),
  getById: (id) => apiClient.get(`/papers/${id}`),
  getByConference: (id) => apiClient.get(`/papers/conference/${id}`),
  getByAuthor: (id) => apiClient.get(`/papers/author/${id}`),
  create: (data) => apiClient.post("/papers", data),
  updateStatus: (id, status) => apiClient.patch(`/papers/${id}/status`, { status }),
  uploadPdf: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`http://localhost:8080/api/papers/${id}/upload`, {
      method: "POST",
      body: formData,
    });
  },
};
