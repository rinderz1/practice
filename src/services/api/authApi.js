const AUTH_STORAGE_KEY = "conference_cms_auth";
const USER_STORE_KEY = "conference_cms_users";

const DEFAULT_USERS = [
  {
    id: "admin-1",
    fullName: "Администратор",
    email: "admin@example.com",
    password: "admin123",
    roles: ["admin"],
  },
];

function seedDefaultUsers() {
  const users = JSON.parse(localStorage.getItem(USER_STORE_KEY)) || [];
  const hasAdmin = users.some((user) => user.roles?.includes("admin"));

  if (!hasAdmin) {
    localStorage.setItem(USER_STORE_KEY, JSON.stringify([...users, ...DEFAULT_USERS]));
  }
}

function saveAuthUser(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function clearAuthUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function login(email, password) {
  seedDefaultUsers();
  const users = JSON.parse(localStorage.getItem(USER_STORE_KEY)) || [];
  seedDefaultUsers();
  const foundUser = users.find((item) => item.email === email && item.password === password);

  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!foundUser) {
    throw new Error("Неверный email или пароль");
  }

  const authUser = {
    id: foundUser.id,
    fullName: foundUser.fullName || foundUser.email,
    email: foundUser.email,
    roles: foundUser.roles || ["author"],
  };

  saveAuthUser(authUser);
  return authUser;
}

export async function register(payload) {
  seedDefaultUsers();
  const users = JSON.parse(localStorage.getItem(USER_STORE_KEY)) || [];
  const exists = users.some((item) => item.email === payload.email);

  await new Promise((resolve) => setTimeout(resolve, 300));

  if (exists) {
    throw new Error("Пользователь с таким email уже существует");
  }

  const newUser = {
    id: Date.now().toString(),
    fullName: payload.fullName || payload.email,
    email: payload.email,
    password: payload.password,
    roles: ["author"],
  };

  users.push(newUser);
  localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
  const authUser = { id: newUser.id, fullName: newUser.fullName, email: newUser.email, roles: newUser.roles };
  saveAuthUser(authUser);
  return authUser;
}

export function logout() {
  clearAuthUser();
  return Promise.resolve();
}

export function restoreSession() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}
