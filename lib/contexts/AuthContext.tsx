"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { signIn, signUp, signOut, getSession } from "@/lib/auth-client";

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
      const sessionData = await getSession();

      if (sessionData?.data?.user && sessionData?.data?.session) {
        setUser(sessionData.data.user);
        setSession(sessionData.data.session);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
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

      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(handleBetterAuthError(result));
      }

      if (result.data?.user && result.data?.token) {
        setUser(result.data.user);
        setSession({
          id: "temp",
          userId: result.data.user.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          token: result.data.token,
        });
      } else {
        throw new Error("Invalid response from authentication server");
      }
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

      const result = await signUp.email({
        email: userData.email,
        password: userData.password,
        name: `${userData.firstName} ${userData.lastName}`,
      });

      if (result.error) {
        throw new Error(handleBetterAuthError(result));
      }

      if (result.data?.user) {
        setUser(result.data.user);
        setSession({
          id: "temp-signup",
          userId: result.data.user.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          token: result.data.token || "temp-token",
        });
      } else {
        throw new Error("Invalid response from authentication server");
      }
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

      await signOut();

      setUser(null);
      setSession(null);
    } catch (error) {
      const errorMessage = handleBetterAuthError(error);
      setError(errorMessage);
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize session on mount
    refreshSession();
  }, []);

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
