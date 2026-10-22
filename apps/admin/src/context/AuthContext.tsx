import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { adminApi, type AdminUser } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('orbit_admin_user');
    const token = localStorage.getItem('orbit_admin_token');
    if (stored && token) {
      try {
        setAdmin(JSON.parse(stored) as AdminUser);
      } catch {
        localStorage.removeItem('orbit_admin_user');
        localStorage.removeItem('orbit_admin_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await adminApi.login(email, password);
    localStorage.setItem('orbit_admin_token', data.token);
    localStorage.setItem('orbit_admin_user', JSON.stringify(data.user));
    setAdmin(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch {
      // Ignore server errors on logout
    } finally {
      localStorage.removeItem('orbit_admin_token');
      localStorage.removeItem('orbit_admin_user');
      setAdmin(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
