import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { signIn, signUp, signOut, getSession, oauth2 } from '@/lib/auth-client';
import { errorHandler } from '@/lib/utils/error-handler';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'ADMIN' | 'PREMIUM';
  currentPlan?: 'FREE' | 'PRO' | 'ULTIMATE';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
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

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
}

interface AuthState {
  // Core auth data
  user: User | null;
  session: Session | null;
  
  // Loading states
  loading: boolean;
  loginLoading: boolean;
  signupLoading: boolean;
  logoutLoading: boolean;
  refreshLoading: boolean;
  
  // Error states
  error: string | null;
  loginError: string | null;
  signupError: string | null;
  
  // Auth status flags
  isAuthenticated: boolean;
  isInitialized: boolean; // Whether initial session check is complete
  sessionChecked: boolean;
  
  // User preferences (persistent)
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    dashboard: {
      defaultView: 'overview' | 'accounts' | 'crypto';
      compactMode: boolean;
      showTestnets: boolean;
    };
  };
  
  // Session management
  lastActivity: Date | null;
  lastLoginDate: string | null; // Track last login date (YYYY-MM-DD format)
  sessionTimeout: number; // in minutes
  autoLogoutTimer: NodeJS.Timeout | null;
}

interface AuthActions {
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'apple' | 'github') => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  
  // Error management
  clearError: () => void;
  clearAuthErrors: () => void;
  
  // User management
  updateUser: (updates: Partial<User>) => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  
  // Preferences management
  updatePreferences: (updates: Partial<AuthState['preferences']>) => void;
  resetPreferences: () => void;
  
  // Session management
  updateLastActivity: () => void;
  updateLastLoginDate: () => void;
  isFirstLoginToday: () => boolean;
  startAutoLogoutTimer: () => void;
  clearAutoLogoutTimer: () => void;
  isSessionExpired: () => boolean;
  
  // Utility actions
  resetAuthState: () => void;
}

type AuthStore = AuthState & AuthActions;

const defaultPreferences: AuthState['preferences'] = {
  theme: 'system',
  language: 'en',
  currency: 'USD',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  dashboard: {
    defaultView: 'overview',
    compactMode: false,
    showTestnets: false,
  },
};

const initialState: AuthState = {
  // Core auth data
  user: null,
  session: null,
  
  // Loading states
  loading: false,
  loginLoading: false,
  signupLoading: false,
  logoutLoading: false,
  refreshLoading: false,
  
  // Error states
  error: null,
  loginError: null,
  signupError: null,
  
  // Auth status flags
  isAuthenticated: false,
  isInitialized: false,
  sessionChecked: false,
  
  // User preferences
  preferences: defaultPreferences,
  
  // Session management
  lastActivity: null,
  lastLoginDate: null,
  sessionTimeout: 480, // 8 hours of inactivity before auto-logout (separate from backend 7-day session)
  autoLogoutTimer: null,
};

// Helper function to handle Better Auth errors
const handleBetterAuthError = (error: unknown): string => {
  if (error?.error) {
    // Better Auth specific error format
    if (error.error.message) {
      return error.error.message;
    }
    if (typeof error.error === 'string') {
      return error.error;
    }
  }

  if (error?.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // Auth actions
        login: async (email, password) => {
          set((state) => {
            state.loginLoading = true;
            state.loginError = null;
            state.error = null;
          }, false, 'login/loading');

          try {
            const result = await signIn.email({
              email,
              password,
            });

            if (result.error) {
              throw new Error(handleBetterAuthError(result));
            }

            if (result.data?.user && result.data?.token) {
              // Get actual session expiry from backend (7 days from login config)
              const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;

              set((state) => {
                state.user = result.data!.user;
                state.session = {
                  id: 'temp',
                  userId: result.data!.user.id,
                  expiresAt: new Date(Date.now() + sessionDurationMs),
                  token: result.data!.token,
                };
                state.isAuthenticated = true;
                state.loginLoading = false;
                state.lastActivity = new Date();
              }, false, 'login/success');

              // Update last login date and start auto-logout timer
              get().updateLastLoginDate();
              get().startAutoLogoutTimer();
            } else {
              throw new Error('Invalid response from authentication server');
            }
          } catch (error) {
            // Use centralized error handler
            const appError = errorHandler.handleError(error, 'auth-login', {
              showToast: false,
              logError: true,
              throwError: false
            });

            // Check if it's a backend connection error
            if (appError.code === 'BACKEND_UNREACHABLE' || appError.code === 'BACKEND_DOWN') {
              if (typeof window !== 'undefined' && (window as Record<string, unknown>).showBackendError) {
                ((window as Record<string, unknown>).showBackendError as (error: unknown) => void)(error);
              }
            }

            const errorMessage = appError.userMessage;
            set((state) => {
              state.loginError = errorMessage;
              state.error = errorMessage;
              state.loginLoading = false;
            }, false, 'login/error');
            throw error;
          }
        },
        
        signup: async (userData) => {
          set((state) => {
            state.signupLoading = true;
            state.signupError = null;
            state.error = null;
          }, false, 'signup/loading');

          try {
            const result = await signUp.email({
              email: userData.email,
              password: userData.password,
              firstName: userData.firstName,
              lastName: userData.lastName,
              name: `${userData.firstName} ${userData.lastName}`,
            });

            if (result.error) {
              throw new Error(handleBetterAuthError(result));
            }

            if (result.data?.user) {
              // Get actual session expiry from backend (7 days from signup config)
              const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;

              set((state) => {
                state.user = result.data!.user;
                state.session = {
                  id: 'temp-signup',
                  userId: result.data!.user.id,
                  expiresAt: new Date(Date.now() + sessionDurationMs),
                  token: result.data!.token || 'temp-token',
                };
                state.isAuthenticated = true;
                state.signupLoading = false;
                state.lastActivity = new Date();
              }, false, 'signup/success');

              // Update last login date and start auto-logout timer
              get().updateLastLoginDate();
              get().startAutoLogoutTimer();
            } else {
              throw new Error('Invalid response from authentication server');
            }
          } catch (error) {
            // Use centralized error handler
            const appError = errorHandler.handleError(error, 'auth-signup', {
              showToast: false,
              logError: true,
              throwError: false
            });

            // Check if it's a backend connection error
            if (appError.code === 'BACKEND_UNREACHABLE' || appError.code === 'BACKEND_DOWN') {
              if (typeof window !== 'undefined' && (window as Record<string, unknown>).showBackendError) {
                ((window as Record<string, unknown>).showBackendError as (error: unknown) => void)(error);
              }
            }

            const errorMessage = appError.userMessage;
            set((state) => {
              state.signupError = errorMessage;
              state.error = errorMessage;
              state.signupLoading = false;
            }, false, 'signup/error');
            throw error;
          }
        },

        loginWithOAuth: async (provider) => {
          set((state) => {
            state.loginLoading = true;
            state.loginError = null;
            state.error = null;
          }, false, 'loginWithOAuth/loading');

          try {
            console.log(`[Auth] Starting OAuth flow for provider: ${provider}`);

            const callbackURL = `${window.location.origin}/dashboard`;
            console.log(`[Auth] OAuth callback URL: ${callbackURL}`);

            // Initiate OAuth flow - this will redirect to provider
            const result = await oauth2.signIn({
              provider,
              callbackURL,
            });

            console.log(`[Auth] OAuth response:`, result);

            // Note: If we reach here, the provider returned us to the app
            // or oauth2.signIn returned successfully
            // getSession() will be called on the next app initialization

            // If we have a user, update the store
            if (result?.user) {
              set((state) => {
                state.user = result.user as any;
                state.isAuthenticated = true;
                state.loginLoading = false;
                state.lastActivity = new Date();
              }, false, 'loginWithOAuth/success');

              // Start auto-logout timer
              get().updateLastLoginDate();
              get().startAutoLogoutTimer();
            } else {
              console.log('[Auth] OAuth sign in completed, waiting for session initialization');
            }
          } catch (error) {
            console.error(`[Auth] OAuth error for provider ${provider}:`, error);

            // Use centralized error handler
            const appError = errorHandler.handleError(error, `auth-oauth-${provider}`, {
              showToast: false,
              logError: true,
              throwError: false,
            });

            const errorMessage = appError.userMessage;
            set((state) => {
              state.loginError = errorMessage;
              state.error = errorMessage;
              state.loginLoading = false;
            }, false, 'loginWithOAuth/error');

            console.error(`[Auth] OAuth login failed: ${errorMessage}`);
            throw error;
          }
        },

        logout: async () => {
          set((state) => {
            state.logoutLoading = true;
            state.error = null;
          }, false, 'logout/loading');
          
          try {
            await signOut();
            
            // Clear auto-logout timer
            get().clearAutoLogoutTimer();
            
            set((state) => {
              state.user = null;
              state.session = null;
              state.isAuthenticated = false;
              state.logoutLoading = false;
              state.lastActivity = null;
              // Keep preferences but clear auth data
            }, false, 'logout/success');
          } catch (error) {
            // Use centralized error handler
            const appError = errorHandler.handleError(error, 'auth-logout', {
              showToast: false,
              logError: true,
              throwError: false
            });

            // For logout errors, we don't need to show backend error UI since we're logging out anyway
            // Just log the error and continue with clearing local state

            set((state) => {
              state.error = appError.userMessage;
              state.logoutLoading = false;
            }, false, 'logout/error');

            // Even if logout fails, clear local state
            set((state) => {
              state.user = null;
              state.session = null;
              state.isAuthenticated = false;
              state.lastActivity = null;
            }, false, 'logout/force');

            get().clearAutoLogoutTimer();
            console.error('Logout failed:', error);
          }
        },
        
        refreshSession: async () => {
          set((state) => {
            state.refreshLoading = true;
          }, false, 'refreshSession/loading');

          try {
            const sessionData = await getSession();

            if (sessionData?.data?.user && sessionData?.data?.session) {
              set((state) => {
                state.user = sessionData.data!.user;
                state.session = sessionData.data!.session;
                state.isAuthenticated = true;
                state.sessionChecked = true;
                state.refreshLoading = false;
                state.lastActivity = new Date();
              }, false, 'refreshSession/success');

              // Restart auto-logout timer with fresh session
              get().startAutoLogoutTimer();
            } else {
              set((state) => {
                state.user = null;
                state.session = null;
                state.isAuthenticated = false;
                state.sessionChecked = true;
                state.refreshLoading = false;
                state.lastActivity = null;
              }, false, 'refreshSession/unauthenticated');

              get().clearAutoLogoutTimer();
            }
          } catch (error) {
            console.error('Session refresh failed:', error);

            // Use centralized error handler for backend connection errors
            const appError = errorHandler.handleError(error, 'auth-session', {
              showToast: false, // Don't show toast for auth errors, let global handler decide
              logError: true,
              throwError: false
            });

            // Check if it's a backend connection error that should trigger global error UI
            if (appError.code === 'BACKEND_UNREACHABLE' || appError.code === 'BACKEND_DOWN') {
              // Trigger global error handler through window
              if (typeof window !== 'undefined' && (window as Record<string, unknown>).showBackendError) {
                ((window as Record<string, unknown>).showBackendError as (error: unknown) => void)(error);
              }
            }

            set((state) => {
              state.user = null;
              state.session = null;
              state.isAuthenticated = false;
              state.sessionChecked = true;
              state.refreshLoading = false;
              state.lastActivity = null;
            }, false, 'refreshSession/error');

            get().clearAutoLogoutTimer();
          }
        },
        
        initializeAuth: async () => {
          if (get().isInitialized) return;
          
          set((state) => {
            state.loading = true;
          }, false, 'initializeAuth/loading');
          
          await get().refreshSession();
          
          set((state) => {
            state.isInitialized = true;
            state.loading = false;
          }, false, 'initializeAuth/complete');
        },
        
        // Error management
        clearError: () =>
          set((state) => {
            state.error = null;
          }, false, 'clearError'),
        
        clearAuthErrors: () =>
          set((state) => {
            state.error = null;
            state.loginError = null;
            state.signupError = null;
          }, false, 'clearAuthErrors'),
        
        // User management
        updateUser: (updates) =>
          set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
            }
          }, false, 'updateUser'),
        
        updateUserProfile: async (updates) => {
          // This would typically make an API call to update user profile
          // For now, just update local state
          get().updateUser(updates);
          // TODO: Implement actual API call when backend endpoint is ready
        },
        
        // Preferences management
        updatePreferences: (updates) =>
          set((state) => {
            Object.assign(state.preferences, updates);
          }, false, 'updatePreferences'),
        
        resetPreferences: () =>
          set((state) => {
            state.preferences = { ...defaultPreferences };
          }, false, 'resetPreferences'),
        
        // Session management
        updateLastActivity: () => {
          const now = new Date();
          const lastActivity = get().lastActivity;

          // Only update if at least 1 minute has passed (debounce)
          if (lastActivity && (now.getTime() - lastActivity.getTime()) < 60000) {
            return;
          }

          set((state) => {
            state.lastActivity = now;
          }, false, 'updateLastActivity');

          // Restart the auto-logout timer
          if (get().isAuthenticated) {
            get().startAutoLogoutTimer();
          }

          // Check if session is expiring soon (within 1 hour)
          const session = get().session;
          if (session && !get().isSessionExpired()) {
            const timeUntilExpiry = new Date(session.expiresAt).getTime() - now.getTime();
            const oneHourMs = 60 * 60 * 1000;

            // If session expires within 1 hour, refresh it in the background
            if (timeUntilExpiry < oneHourMs && timeUntilExpiry > 0) {
              get().refreshSession();
            }
          }
        },

        updateLastLoginDate: () => {
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
          set((state) => {
            state.lastLoginDate = today;
          }, false, 'updateLastLoginDate');
        },

        isFirstLoginToday: () => {
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
          const lastLogin = get().lastLoginDate;
          return lastLogin !== today;
        },
        
        startAutoLogoutTimer: () => {
          get().clearAutoLogoutTimer();
          
          const timeoutMs = get().sessionTimeout * 60 * 1000;
          const timer = setTimeout(() => {
            get().logout();
          }, timeoutMs);
          
          set((state) => {
            state.autoLogoutTimer = timer;
          }, false, 'startAutoLogoutTimer');
        },
        
        clearAutoLogoutTimer: () => {
          const timer = get().autoLogoutTimer;
          if (timer) {
            clearTimeout(timer);
            set((state) => {
              state.autoLogoutTimer = null;
            }, false, 'clearAutoLogoutTimer');
          }
        },
        
        isSessionExpired: () => {
          const session = get().session;
          if (!session) return true;
          
          const now = new Date();
          const expiresAt = new Date(session.expiresAt);
          return now >= expiresAt;
        },
        
        // Utility actions
        resetAuthState: () => {
          get().clearAutoLogoutTimer();
          set(() => ({
            ...initialState,
            preferences: get().preferences, // Keep preferences
          }), false, 'resetAuthState');
        },
      })),
      {
        name: 'auth-store',
        partialize: (state) => ({
          // Only persist these parts of the state
          preferences: state.preferences,
          sessionTimeout: state.sessionTimeout,
          lastLoginDate: state.lastLoginDate,
        }),
        onRehydrateStorage: () => (state) => {
          // Initialize auth state but don't clear existing auth
          if (state) {
            // Only set loading to false and mark as not initialized
            // Don't clear user/session data - let initializeAuth handle session validation
            state.loading = false;
            state.isInitialized = false;
            state.sessionChecked = false;
            if (state.autoLogoutTimer) {
              state.autoLogoutTimer = null;
            }
          }
        },
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Selectors for better performance and convenience
export const selectUser = (state: AuthStore) => state.user;
export const selectSession = (state: AuthStore) => state.session;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => 
  state.loading || state.loginLoading || state.signupLoading || state.refreshLoading;
export const selectHasError = (state: AuthStore) => 
  !!(state.error || state.loginError || state.signupError);
export const selectAuthError = (state: AuthStore) => 
  state.error || state.loginError || state.signupError;
export const selectPreferences = (state: AuthStore) => state.preferences;
export const selectIsInitialized = (state: AuthStore) => state.isInitialized;
export const selectLastActivity = (state: AuthStore) => state.lastActivity;

// Computed selectors
export const selectUserDisplayName = (state: AuthStore) => {
  const user = state.user;
  if (!user) return null;
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  if (user.name) {
    return user.name;
  }
  
  return user.email;
};

export const selectUserInitials = (state: AuthStore) => {
  const user = state.user;
  if (!user) return '';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  
  if (user.name) {
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  
  return user.email[0].toUpperCase();
};