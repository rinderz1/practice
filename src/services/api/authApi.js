import { apiClient } from "./apiClient";

const AUTH_STORAGE_KEY = "conference_cms_auth";

function saveAuthUser(user) {
  // Store only the required fields: { id, fullName, email, systemRole }
  const userData = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    systemRole: user.systemRole
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
}

function clearAuthUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function login(email, password) {
  const user = await apiClient.post("/auth/login", { email, password });
  saveAuthUser(user);
  return user;
}

export async function register(payload) {
  const user = await apiClient.post("/auth/register", payload);
  saveAuthUser(user);
  return user;
}

export async function logout() {
  clearAuthUser();
  return Promise.resolve();
}

export function restoreSession() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}
