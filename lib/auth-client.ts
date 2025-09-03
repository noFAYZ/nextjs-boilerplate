import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL || "http://localhost:3000",

  fetchOptions: {
    credentials: 'include', // Important for cookie-based sessions
  },
});

export const {
  signIn,
  signUp,
  signOut,
  resetPassword,
  forgetPassword,
  verifyEmail,
  getSession,
  useSession,
} = authClient;