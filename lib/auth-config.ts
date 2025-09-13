import { betterAuth } from "better-auth";
import { logger } from "@/lib/utils/logger";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || "your-development-secret-key-that-is-at-least-32-characters-long",
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
      // This will be implemented by the backend
      logger.info("Reset password email sent", { email: user.email });
    },
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      // This will be implemented by the backend
      logger.info("Verification email sent", { email: user.email });
    },
    autoSignIn: false, // Require email verification before auto sign-in
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache for 5 minutes
    },
  },
  
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        input: true, // Allow input during registration
      },
      lastName: {
        type: "string", 
        required: false,
        input: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // Don't allow user input for role
      },
      currentPlan: {
        type: "string",
        required: false,
        defaultValue: "FREE",
        input: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "PENDING_VERIFICATION",
        input: false,
      },
      profilePicture: {
        type: "string",
        required: false,
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      dateOfBirth: {
        type: "string",
        required: false,
        input: true,
      },
      monthlyIncome: {
        type: "number",
        required: false,
        input: true,
      },
      currency: {
        type: "string",
        required: false,
        defaultValue: "USD",
        input: true,
      },
      timezone: {
        type: "string",
        required: false,
        defaultValue: "UTC",
        input: true,
      },
    },
  },
  
  rateLimit: {
    window: 60, // 1 minute
    max: process.env.NODE_ENV === "production" ? 50 : 100, // More restrictive in prod
    storage: "memory",
    skipOnError: false,
  },
  
  trustedOrigins: [
    "http://localhost:3000",
    "https://localhost:3000",
    ...(process.env.NODE_ENV === "production" 
      ? [process.env.NEXT_PUBLIC_APP_URL || ""] 
      : []
    ),
  ],
  
  // Security configurations
  cookies: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  },
  
  csrf: {
    enabled: true,
    cookieName: "better-auth.csrf-token",
  },
  
  plugins: [
    // Add any additional plugins here
  ],
  
  // Advanced session management
  advanced: {
    crossSubDomainCookies: {
      enabled: false, // Enable if you need cross-subdomain auth
    },
    generateId: () => crypto.randomUUID(),
  },
});

// Export auth instance for API route
export { auth as default };

// Note: Type inference from better-auth may need to be implemented differently
// For now, we'll use the types defined in our types.ts file