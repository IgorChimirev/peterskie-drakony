import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, getToken, setToken } from "../api/client";
import type { AuthUser, Role } from "../api/types";

const USER_KEY = "cd_user";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (fullName: string, email: string, password: string, phone: string, accountType: string) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const savedUser = localStorage.getItem(USER_KEY);
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function persist(fullName: string, role: Role, token: string): AuthUser {
    const authUser: AuthUser = { fullName, role };
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return authUser;
  }

  async function login(email: string, password: string) {
    const res = await api.auth.login(email, password);
    return persist(res.fullName, res.role, res.token);
  }

  async function register(fullName: string, email: string, password: string, phone: string, accountType: string) {
    const res = await api.auth.register(fullName, email, password, phone, accountType);
    return persist(res.fullName, res.role, res.token);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  async function refreshUser() {
    const me = await api.auth.me();
    if (user) {
      const updated = { ...user, fullName: me.fullName };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      setUser(updated);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
