import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/Api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rxUser")) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authAPI.login(credentials);
      const userData = data.user || data.data || data;
      setUser(userData);
      localStorage.setItem("rxUser", JSON.stringify(userData));
      return userData;
    } finally { setLoading(false); }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const data = await authAPI.signup(payload);
      const userData = data.user || data.data || data;
      setUser(userData);
      localStorage.setItem("rxUser", JSON.stringify(userData));
      return userData;
    } finally { setLoading(false); }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rxUser");
  };

  const isAdmin = (user?.roles || []).some((r) => String(r).toUpperCase() === "ADMIN");

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
