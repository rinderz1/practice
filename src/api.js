const BASE_URL = "http://localhost:8080/api";

// AUTH
export const register = async (fullName, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password })
  });
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

// USERS
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
};

export const updateUserRole = async (userId, systemRole) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemRole })
  });
  return res.json();
};

// CONFERENCES
export const getConferences = async () => {
  const res = await fetch(`${BASE_URL}/conferences`);
  return res.json();
};

export const getConference = async (id) => {
  const res = await fetch(`${BASE_URL}/conferences/${id}`);
  return res.json();
};

export const createConference = async (data, userId) => {
  const res = await fetch(`${BASE_URL}/conferences?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

// PAPERS
export const getPapersByConference = async (conferenceId) => {
  const res = await fetch(`${BASE_URL}/papers/conference/${conferenceId}`);
  return res.json();
};

export const getPapersByAuthor = async (userId) => {
  const res = await fetch(`${BASE_URL}/papers/author/${userId}`);
  return res.json();
};

export const createPaper = async (data) => {
  const res = await fetch(`${BASE_URL}/papers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const changePaperStatus = async (paperId, status) => {
  const res = await fetch(`${BASE_URL}/papers/${paperId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return res.json();
};