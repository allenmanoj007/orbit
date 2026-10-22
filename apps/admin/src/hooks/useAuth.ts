import { useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import type { AdminUser } from '../services/api';

/**
 * Convenience hook — re-exports the AuthContext value so consumers
 * don't need to import AuthContext directly.
 */
export function useAuth(): {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
} {
  const { admin, isLoading, login, logout } = useAuthContext();

  const stableLogin = useCallback(
    (email: string, password: string) => login(email, password),
    [login],
  );

  const stableLogout = useCallback(() => logout(), [logout]);

  return {
    admin,
    isLoading,
    login: stableLogin,
    logout: stableLogout,
    isAdmin: !!admin?.isAdmin,
  };
}
