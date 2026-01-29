/**
 * Environment Variable Validation for MoneyMappr Frontend
 * Ensures all required environment variables are present and valid
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // App Configuration
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').optional(),
  
  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL').optional(),
  API_SECRET_KEY: z.string().min(32, 'API_SECRET_KEY must be at least 32 characters').optional(),
  
  // Authentication (optional in development)
  BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters').optional(),
  BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL').optional(),
  
  // Database (optional in development)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').optional(),
  
  // External Services
  NEXT_PUBLIC_SENTRY_DSN: z.string().url('NEXT_PUBLIC_SENTRY_DSN must be a valid URL').optional(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  
  // Payment Processing
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'STRIPE_SECRET_KEY must start with sk_').optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Email Services
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // File Storage
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  
  // Crypto/Financial APIs
  COINMARKETCAP_API_KEY: z.string().optional(),
  PLAID_CLIENT_ID: z.string().optional(),
  PLAID_SECRET: z.string().optional(),
  PLAID_ENV: z.enum(['sandbox', 'development', 'production']).optional(),
});

// Define the type for validated environment variables
export type Env = z.infer<typeof envSchema>;

// Validate environment variables
function validateEnv(): Env {
  try {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      API_SECRET_KEY: process.env.API_SECRET_KEY,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      DATABASE_URL: process.env.DATABASE_URL,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION,
      AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
      COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
      PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
      PLAID_SECRET: process.env.PLAID_SECRET,
      PLAID_ENV: process.env.PLAID_ENV,
    };

    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors?.map(err => `${err.path.join('.')}: ${err.message}`)?.join('\n') || 'Unknown validation errors';
      throw new Error(
        `❌ Invalid environment variables:\n${missingVars}\n\n` +
        `Please check your .env.local file and ensure all required variables are set with valid values.`
      );
    }
    throw error;
  }
}

// Generate secure secrets helper
export function generateSecureSecret(length: number = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Environment-specific configurations
export const getEnvConfig = () => {
  const env = validateEnv();
  
  return {
    // App Configuration
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
    appUrl: env.NEXT_PUBLIC_APP_URL,
    apiUrl: env.NEXT_PUBLIC_API_URL,
    
    // Feature Flags (based on environment)
    features: {
      analytics: !!env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && env.NODE_ENV === 'production',
      errorTracking: !!env.NEXT_PUBLIC_SENTRY_DSN,
      payments: !!env.STRIPE_SECRET_KEY && !!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      bankIntegration: !!env.PLAID_CLIENT_ID && !!env.PLAID_SECRET,
      cryptoIntegration: !!env.COINMARKETCAP_API_KEY,
      fileUploads: !!env.AWS_ACCESS_KEY_ID && !!env.AWS_SECRET_ACCESS_KEY,
      emailService: !!env.RESEND_API_KEY || (!!env.SMTP_HOST && !!env.SMTP_USER),
    },
    
    // Security Configuration
    security: {
      sessionTimeout: env.NODE_ENV === 'production' ? 30 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 min prod, 24 hours dev
      maxLoginAttempts: 5,
      loginAttemptWindow: 15 * 60 * 1000, // 15 minutes
      tokenRefreshWindow: 5 * 60 * 1000, // 5 minutes before expiry
    },
    
    // Rate Limiting
    rateLimiting: {
      api: env.NODE_ENV === 'production' ? 500 : 1000, // requests per 15 minutes
      auth: env.NODE_ENV === 'production' ? 30 : 50,   // requests per 15 minutes
      upload: env.NODE_ENV === 'production' ? 10 : 100, // requests per hour
    }
  };
};

// Validate on import (will throw if invalid)
let validatedEnv: Env;
try {
  validatedEnv = validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
  process.exit(1);
}

// Export validated environment variables
export const env = validatedEnv;
export const config = getEnvConfig();

// Runtime environment checker
export function checkRuntimeEnv() {
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Check required production variables
  if (config.isProduction) {
    if (!env.NEXT_PUBLIC_SENTRY_DSN) {
      warnings.push('NEXT_PUBLIC_SENTRY_DSN not set - error tracking disabled');
    }
    if (!env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      warnings.push('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID not set - analytics disabled');
    }
    if (!config.features.payments) {
      warnings.push('Stripe keys not configured - payments disabled');
    }
    if (!config.features.bankIntegration) {
      warnings.push('Plaid keys not configured - bank integration disabled');
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing,
    warnings,
    features: config.features
  };
}

// Create a .env.example file helper
export function generateEnvExample(): string {
  return `# MoneyMappr Frontend Environment Variables
# Copy this file to .env.local and fill in your values

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Security (Generate secure random strings)
API_SECRET_KEY=${generateSecureSecret(64)}
BETTER_AUTH_SECRET=${generateSecureSecret(64)}
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=sqlite:./dev.db

# Error Tracking (Optional but recommended for production)
# NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io

# Analytics (Optional)
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxx

# Payment Processing (Optional)
# STRIPE_SECRET_KEY=sk_test_xxxxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email Service (Optional - choose one)
# RESEND_API_KEY=re_xxxxx
# OR
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# File Storage (Optional)
# AWS_ACCESS_KEY_ID=AKIAXXXXXXXX
# AWS_SECRET_ACCESS_KEY=xxxxxxxx
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=moneymappr-uploads

# Financial APIs (Optional)
# COINMARKETCAP_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# PLAID_CLIENT_ID=xxxxxxxx
# PLAID_SECRET=xxxxxxxx
# PLAID_ENV=sandbox
`;
}

export default env;