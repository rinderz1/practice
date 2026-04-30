import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest, logout as logoutRequest, restoreSession as restoreAuthSession, register as registerRequest } from "../../services/api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    async function init() {
      const storedUser = await restoreAuthSession();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }

    init();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const authUser = await loginRequest(email, password);
      setUser(authUser);
      setIsAuthenticated(true);
      return authUser;
    } catch (error) {
      setAuthError(error.message || "Ошибка при входе");
      throw error;
    }
  };

  const register = async (payload) => {
    setAuthError(null);
    try {
      const authUser = await registerRequest(payload);
      setUser(authUser);
      setIsAuthenticated(true);
      return authUser;
    } catch (error) {
      setAuthError(error.message || "Ошибка регистрации");
      throw error;
    }
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      authError,
      login,
      logout,
      register,
    }),
    [user, isAuthenticated, isLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
