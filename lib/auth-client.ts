import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL || "http://localhost:3000",

  fetchOptions: {
    credentials: 'include', // Important for cookie-based sessions
  },
});

// Export auth functions
const {
  signIn,
  signUp,
  signOut,
  resetPassword,
  forgetPassword,
  verifyEmail,
  getSession: originalGetSession,
  useSession,
  oauth2,
} = authClient;

// Request deduplication for getSession
type SessionData = Awaited<ReturnType<typeof originalGetSession>>;
let sessionPromise: Promise<SessionData> | null = null;
let sessionCache: { data: SessionData; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds

/**
 * Optimized getSession with request deduplication and caching
 * Prevents duplicate API calls when multiple components mount simultaneously
 */
export const getSession = async () => {
  const now = Date.now();

  // Return cached data if fresh
  if (sessionCache && (now - sessionCache.timestamp) < CACHE_DURATION) {
    return sessionCache.data;
  }

  // Return in-flight request if exists
  if (sessionPromise) {
    return sessionPromise;
  }

  // Create new request
  sessionPromise = originalGetSession()
    .then((data) => {
      sessionCache = { data, timestamp: now };
      sessionPromise = null;
      return data;
    })
    .catch((error) => {
      sessionPromise = null;
      throw error;
    });

  return sessionPromise;
};

export {
  signIn,
  signUp,
  signOut,
  resetPassword,
  forgetPassword,
  verifyEmail,
  useSession,
  oauth2,
};