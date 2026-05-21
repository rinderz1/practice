import { apiClient } from "./apiClient";

export const usersApi = {
  getAll: () => apiClient.get("/users"),
  updateRole: (id, systemRole) => apiClient.patch(`/users/${id}/role`, { systemRole }),
};
