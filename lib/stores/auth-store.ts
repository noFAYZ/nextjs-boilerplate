import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { signIn, signUp, signOut, getSession } from '@/lib/auth-client';

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
  sessionTimeout: 60, // 60 minutes
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
              set((state) => {
                state.user = result.data!.user;
                state.session = {
                  id: 'temp',
                  userId: result.data!.user.id,
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
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
            const errorMessage = handleBetterAuthError(error);
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
              set((state) => {
                state.user = result.data!.user;
                state.session = {
                  id: 'temp-signup',
                  userId: result.data!.user.id,
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
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
            const errorMessage = handleBetterAuthError(error);
            set((state) => {
              state.signupError = errorMessage;
              state.error = errorMessage;
              state.signupLoading = false;
            }, false, 'signup/error');
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
            const errorMessage = handleBetterAuthError(error);
            set((state) => {
              state.error = errorMessage;
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
          set((state) => {
            state.lastActivity = new Date();
          }, false, 'updateLastActivity');

          // Restart the auto-logout timer
          if (get().isAuthenticated) {
            get().startAutoLogoutTimer();
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