import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User { id: string; name: string; email: string; }

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/todos`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    setUser(await res.json());
  }

  async function register(name: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    setUser(await res.json());
  }

  async function logout() {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  }

  async function forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.message as string;
  }

  async function resetPassword(token: string, password: string) {
    const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.message as string;
  }


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}