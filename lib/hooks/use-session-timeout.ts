/**
 * Session Timeout Management Hook
 * Handles session expiration warnings, automatic logout, and token refresh
 *
 * PRODUCTION-GRADE: Uses AuthStore instead of making API calls
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { logger } from '@/lib/utils/logger';
import { config } from '@/lib/config/env';

interface SessionTimeoutState {
  isActive: boolean;
  timeRemaining: number;
  showWarning: boolean;
  isRefreshing: boolean;
  lastActivity: Date;
}

interface SessionTimeoutOptions {
  warningTime?: number; // Time before expiry to show warning (ms)
  checkInterval?: number; // How often to check session status (ms)
  onWarning?: () => void;
  onExpiry?: () => void;
  onRefresh?: () => void;
  autoRefresh?: boolean;
}

export function useSessionTimeout(options: SessionTimeoutOptions = {}) {
  const {
    warningTime = 5 * 60 * 1000, // 5 minutes warning
    checkInterval = 60 * 1000, // Check every minute
    onWarning,
    onExpiry,
    onRefresh,
    autoRefresh = true
  } = options;

  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Interval>();
  const lastActivityRef = useRef<Date>(new Date());

  const [state, setState] = useState<SessionTimeoutState>({
    isActive: false,
    timeRemaining: 0,
    showWarning: false,
    isRefreshing: false,
    lastActivity: new Date()
  });

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    lastActivityRef.current = new Date();
    setState(prev => ({
      ...prev,
      lastActivity: new Date(),
      showWarning: false
    }));
    logger.debug('Session activity updated');
  }, []);

  // Activity event listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => updateActivity();
    
    // Add throttling to prevent excessive updates
    let throttleTimer: NodeJS.Timeout;
    const throttledActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleActivity();
        throttleTimer = null;
      }, 30000); // Throttle to every 30 seconds
    };

    events.forEach(event => {
      document.addEventListener(event, throttledActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledActivity, true);
      });
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [updateActivity]);

  // Get current session information from AuthStore (NO API CALLS)
  // PRODUCTION-GRADE: Use Zustand store instead of making API requests
  const getSessionFromStore = useCallback(() => {
    const session = useAuthStore.getState().session;
    const user = useAuthStore.getState().user;
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated || !user || !session) {
      return null;
    }

    return {
      data: {
        session,
        user,
      },
    };
  }, []);

  // Refresh session token
  const refreshSession = useCallback(async () => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    
    try {
      logger.info('Attempting to refresh session token');
      
      // Attempt to refresh the session
      const refreshResult = await authClient.refresh();
      
      if (refreshResult?.data) {
        logger.info('Session refreshed successfully');
        setState(prev => ({ 
          ...prev, 
          isRefreshing: false, 
          showWarning: false,
          isActive: true
        }));
        onRefresh?.();
        return true;
      } else {
        throw new Error('Refresh failed');
      }
    } catch (error) {
      logger.error('Session refresh failed', error);
      setState(prev => ({ ...prev, isRefreshing: false }));
      return false;
    }
  }, [onRefresh]);

  // Handle session expiry
  const handleSessionExpiry = useCallback(async () => {
    logger.warn('Session expired, logging out user');
    
    try {
      // Sign out the user
      await authClient.signOut();
      
      setState(prev => ({ 
        ...prev, 
        isActive: false, 
        showWarning: false,
        timeRemaining: 0
      }));
      
      onExpiry?.();
      
      // Redirect to login page
      router.push('/auth/login?reason=session_expired');
      
    } catch (error) {
      logger.error('Error during session expiry handling', error);
      // Force redirect even if signOut fails
      window.location.href = '/auth/login?reason=session_expired';
    }
  }, [router, onExpiry]);

  // Use refs to store callback functions to avoid dependency issues
  const onWarningRef = useRef(onWarning);
  const refreshSessionRef = useRef(refreshSession);
  const handleSessionExpiryRef = useRef(handleSessionExpiry);
  
  // Update refs when callbacks change
  useEffect(() => {
    onWarningRef.current = onWarning;
    refreshSessionRef.current = refreshSession;
    handleSessionExpiryRef.current = handleSessionExpiry;
  }, [onWarning, refreshSession, handleSessionExpiry]);

  // Check session status and calculate time remaining (NO API CALLS)
  // PRODUCTION-GRADE: Uses AuthStore state instead of fetching from API
  const checkSession = useCallback(async () => {
    try {
      // Get session from store (no API call)
      const sessionData = getSessionFromStore();
      const session = sessionData?.data;

      if (!session?.user) {
        setState(prev => ({ ...prev, isActive: false }));
        return;
      }

      // Calculate time since last activity
      const now = new Date();
      const timeSinceActivity = now.getTime() - lastActivityRef.current.getTime();
      const sessionExpiry = timeSinceActivity + config.security.sessionTimeout;
      const timeRemaining = config.security.sessionTimeout - timeSinceActivity;

      setState(prev => {
        const newState = {
          ...prev,
          isActive: true,
          timeRemaining: Math.max(0, timeRemaining),
          showWarning: timeRemaining <= warningTime && timeRemaining > 0
        };

        // Show warning if close to expiry and not already showing
        if (timeRemaining <= warningTime && timeRemaining > 0 && !prev.showWarning) {
          logger.warn('Session expiring soon, showing warning', { timeRemaining });
          onWarningRef.current?.();
        }

        return newState;
      });

      // Auto-refresh if enabled and within refresh window
      if (autoRefresh && timeRemaining <= config.security.tokenRefreshWindow && timeRemaining > 0) {
        const success = await refreshSessionRef.current();
        if (!success) {
          handleSessionExpiryRef.current();
        }
      }

      // Handle expiry
      if (timeRemaining <= 0) {
        handleSessionExpiryRef.current();
      }

    } catch (error) {
      logger.error('Error checking session status', error);
    }
  }, [getSessionFromStore, warningTime, autoRefresh]);

  // Start session monitoring
  useEffect(() => {
    // Initial check
    checkSession();

    // Set up interval to check session periodically
    intervalRef.current = setInterval(checkSession, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [checkSession, checkInterval]);

  // Manual session extension
  const extendSession = useCallback(async () => {
    updateActivity();
    const success = await refreshSession();
    if (success) {
      logger.info('Session extended manually');
    }
    return success;
  }, [updateActivity, refreshSession]);

  // Manual logout
  const logout = useCallback(async () => {
    logger.info('Manual logout initiated');
    await handleSessionExpiry();
  }, [handleSessionExpiry]);

  // Format time remaining for display
  const formatTimeRemaining = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  return {
    // State
    isSessionActive: state.isActive,
    timeRemaining: state.timeRemaining,
    showWarning: state.showWarning,
    isRefreshing: state.isRefreshing,
    lastActivity: state.lastActivity,
    
    // Actions
    extendSession,
    refreshSession,
    logout,
    updateActivity,
    
    // Utilities
    formatTimeRemaining: () => formatTimeRemaining(state.timeRemaining),
    isNearExpiry: state.timeRemaining <= warningTime,
    minutesRemaining: Math.floor(state.timeRemaining / 60000),
    
    // Configuration
    warningTime,
    sessionTimeout: config.security.sessionTimeout,
  };
}

// Hook for session timeout warnings
export function useSessionWarning() {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sessionTimeout = useSessionTimeout({
    onWarning: () => {
      setShowModal(true);
    },
    onExpiry: () => {
      setShowModal(false);
    }
  });

  // Update countdown when warning is shown
  useEffect(() => {
    if (showModal && sessionTimeout.showWarning) {
      const interval = setInterval(() => {
        setCountdown(sessionTimeout.timeRemaining);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showModal, sessionTimeout.showWarning, sessionTimeout.timeRemaining]);

  const handleExtendSession = async () => {
    const success = await sessionTimeout.extendSession();
    if (success) {
      setShowModal(false);
      setCountdown(0);
    }
  };

  const handleLogout = async () => {
    setShowModal(false);
    await sessionTimeout.logout();
  };

  return {
    showModal,
    countdown,
    formatTimeRemaining: sessionTimeout.formatTimeRemaining,
    onExtendSession: handleExtendSession,
    onLogout: handleLogout,
    onDismiss: () => setShowModal(false),
    isRefreshing: sessionTimeout.isRefreshing,
  };
}