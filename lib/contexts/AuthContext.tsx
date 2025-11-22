"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { signIn, signUp, signOut, getSession } from "@/lib/auth-client";
import { logger } from "@/lib/utils/logger";
import { useAuthStore, selectUser, selectSession, selectIsAuthenticated } from "@/lib/stores/auth-store";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: "USER" | "ADMIN" | "PREMIUM";
  currentPlan?: "FREE" | "PRO" | "ULTIMATE";
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  emailVerified: boolean;
  profilePicture?: string;
  phone?: string;
  dateOfBirth?: string;
  monthlyIncome?: number;
  currency?: string;
  timezone?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  name?: string;
  image?: string | null;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Subscribe to AuthStore changes and actions - use direct state access instead of selectors
  const storeUser = useAuthStore((state) => state.user);
  const storeSession = useAuthStore((state) => state.session);
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeLogin = useAuthStore((state) => state.login);
  const storeSignup = useAuthStore((state) => state.signup);
  const storeLogout = useAuthStore((state) => state.logout);
  const storeRefreshSession = useAuthStore((state) => state.refreshSession);

  const clearError = () => setError(null);

  const handleBetterAuthError = (error: unknown) => {

    if (error?.error) {
      // Better Auth specific error format
      if (error.error.message) {
        return error.error.message;
      }
      if (typeof error.error === "string") {
        return error.error;
      }
    }

    if (error?.message) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return "An unexpected error occurred";
  };

  const refreshSession = async () => {
    try {
      setLoading(true);
      
      // Delegate to AuthStore
      await storeRefreshSession();
    } catch (error) {
      logger.error("Session refresh failed", error);
      const errorMessage = handleBetterAuthError(error);
      setError(errorMessage);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delegate to AuthStore
      await storeLogin(email, password);
    } catch (error) {
      const errorMessage = handleBetterAuthError(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      setLoading(true);
      setError(null);

      // Delegate to AuthStore
      await storeSignup(userData);
    } catch (error) {
      const errorMessage = handleBetterAuthError(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Delegate to AuthStore
      await storeLogout();
    } catch (error) {
      const errorMessage = handleBetterAuthError(error);
      setError(errorMessage);
      logger.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Synchronize with AuthStore state - with stability checks
  useEffect(() => {
    // Only log meaningful changes to reduce console spam
    const hasUserChanged = user?.id !== storeUser?.id;
    const hasSessionChanged = session?.id !== storeSession?.id;

    if (process.env.NODE_ENV === 'development' && (hasUserChanged || hasSessionChanged)) {
      // Auth state synchronization debug info available for development
    }

    // More stable auth state management
    if (!storeIsAuthenticated) {
      // Only clear if we actually have user data to clear
      if (user !== null || session !== null) {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    } else if (storeIsAuthenticated && storeUser && storeSession) {
      // Only update if the actual data has changed (prevent unnecessary re-renders)
      if (hasUserChanged || hasSessionChanged) {
        setUser(storeUser);
        setSession(storeSession);
      }
      setLoading(false);
    } else if (storeIsAuthenticated) {
      // Store says authenticated but no user/session data yet - wait
      setLoading(true);
    }
  }, [storeIsAuthenticated, storeUser?.id, storeSession?.id, user?.id, session?.id]); // Stable dependencies

  // Initialize session on mount - ONLY ONCE
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      // Only initialize if AuthStore doesn't have a user and we haven't initialized yet
      if (!storeUser && !storeIsAuthenticated) {
        await refreshSession();
      }
    };

    if (mounted) {
      initializeSession();
    }

    return () => {
      mounted = false;
    };
    // CRITICAL: Empty dependency array to run ONLY ONCE on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global activity listener - tracks user interactions to keep session alive
  useEffect(() => {
    if (!storeIsAuthenticated) return;

    const updateLastActivity = () => {
      useAuthStore.getState().updateLastActivity();
    };

    // Debounced activity tracking on user interactions
    let activityTimeout: NodeJS.Timeout | null = null;
    const debouncedUpdateActivity = () => {
      if (activityTimeout) clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        updateLastActivity();
      }, 1000); // Debounce: update activity max once per second
    };

    // Track user interactions
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, debouncedUpdateActivity, { passive: true });
    });

    // Also refresh session periodically (every 6 hours) even without user activity
    const refreshInterval = setInterval(() => {
      storeRefreshSession();
    }, 6 * 60 * 60 * 1000); // 6 hours

    return () => {
      // Clean up event listeners
      events.forEach(event => {
        window.removeEventListener(event, debouncedUpdateActivity);
      });

      // Clear interval
      clearInterval(refreshInterval);

      // Clear timeout
      if (activityTimeout) clearTimeout(activityTimeout);
    };
  }, [storeIsAuthenticated, storeRefreshSession]);

  const value: AuthContextType = {
    user,
    session,
    loading,
    login,
    signup,
    logout,
    refreshSession,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
