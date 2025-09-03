# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the frontend for MoneyMappr, a comprehensive financial management platform offering traditional banking integration and cryptocurrency portfolio management. The frontend is built with Next.js 15, TypeScript, and Tailwind CSS with shadcn/ui components.

## Development Commands

```bash
# Development server (with Turbopack)
yarn dev

# Production build (with Turbopack)
yarn build

# Start production server
yarn start

# Lint code
yarn lint
```

The development server runs on http://localhost:3001 (port 3000 is typically used by the backend).

## Architecture & Tech Stack

### Core Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS 4.0 (latest version)
- **UI Components**: shadcn/ui (New York style)
- **Authentication**: Better Auth with email/password and session management
- **HTTP Client**: Axios for API communication
- **Forms**: React Hook Form with Zod validation
- **Theme Management**: next-themes for dark/light mode
- **Icons**: Lucide React
- **Fonts**: Geist Sans and Geist Mono (optimized with next/font)

### Project Structure
```
app/                    # Next.js App Router pages
├── api/auth/[...all]/ # Better Auth API route handler
├── auth/             # Authentication pages (login, signup, etc.)
├── dashboard/        # Protected dashboard pages
├── layout.tsx        # Root layout with theme provider
├── page.tsx          # Homepage
└── globals.css       # Global Tailwind styles

components/
├── auth/             # Authentication components
│   ├── auth-form.tsx # Reusable auth form component
│   ├── AuthGuard.tsx # Route protection wrapper
│   └── SessionProvider.tsx # Session context provider
├── providers/        # React context providers
│   ├── providers.tsx # Main providers wrapper
│   ├── theme-provider.tsx # Theme provider component
│   └── error-boundary.tsx # Global error boundary
└── ui/              # shadcn/ui components (auto-generated)

lib/
├── contexts/        # React contexts
├── hooks/          # Custom React hooks
├── auth-client.ts  # Better Auth client configuration
├── auth-config.ts  # Better Auth server configuration  
├── api-client.ts   # Axios API client with auth
├── api.ts         # API helper functions
└── utils.ts       # Utility functions (cn helper)

middleware.ts          # Route protection and security headers
```

### Configuration Files
- `components.json` - shadcn/ui configuration (New York style, CSS variables)
- `tsconfig.json` - TypeScript configuration with path mapping (@/*)
- `eslint.config.mjs` - ESLint configuration extending Next.js rules
- `next.config.ts` - Next.js configuration (currently minimal)

## Backend Integration

The frontend integrates with a comprehensive MoneyMappr backend API. Key integration points:

### API Base URL
- Development: `http://localhost:3000/api/v1`
- Authentication: Bearer Token (JWT)

### Implemented Features
1. **Authentication System** - Complete Better Auth integration with:
   - Email/password authentication with verification
   - Session management with 7-day expiration
   - Protected routes via middleware
   - Auth guards and context providers
   - Password reset and email verification flows
2. **Route Protection** - Middleware-based protection with security headers
3. **API Integration** - Axios client with authentication headers

### Core Features to Implement
1. **Cryptocurrency Portfolio** - Multi-wallet crypto tracking and management
2. **Subscription Management** - Free/Pro/Ultimate tiers with usage limits
3. **Payment Processing** - Stripe integration for subscriptions
4. **User Profile Management** - Extended profile settings and preferences

### Important Backend Details
- Rate limiting is implemented (100 req/15min general, 10 req/min writes)
- All responses follow consistent success/error format
- Comprehensive error handling with specific error codes
- Real-time sync operations for crypto wallets

## Theme System

The app uses next-themes with automatic system detection:

### Implementation Notes
- `suppressHydrationWarning` is required on `<html>` element to prevent hydration mismatches
- Theme classes are applied dynamically by next-themes
- CSS variables are used for theming (configured in components.json)

### Fixed Hydration Issues
The project had hydration errors due to:
1. Nested HTML elements in provider components
2. Server-client theme attribute mismatches

These have been resolved by:
- Removing HTML structure from Providers component
- Adding suppressHydrationWarning to layout
- Proper font variable application

## Development Guidelines

### Component Development
- Follow shadcn/ui patterns for new components
- Use the `cn()` utility for conditional classes
- Implement proper TypeScript interfaces
- Follow Next.js App Router conventions
- Wrap protected pages with `AuthGuard` component
- Use React Hook Form with Zod validation for forms

### Styling Conventions
- Use Tailwind CSS classes
- Follow shadcn/ui design tokens
- Support both light and dark themes
- Use CSS variables for consistent theming

### Code Organization
- Components go in `components/` with logical sub-directories
- Use absolute imports with `@/` prefix
- Keep utilities in `lib/`
- Follow TypeScript strict mode requirements

## Common Patterns

### API Integration
```typescript
// Use the configured API client (lib/api-client.ts)
import { apiClient } from '@/lib/api-client';

// API client automatically handles authentication headers
const response = await apiClient.get('/endpoint');
const result = response.data;
if (!result.success) {
  throw new Error(result.error.message);
}
```

### Authentication Flow
```typescript
// Using Better Auth client (lib/auth-client.ts)
import { authClient } from '@/lib/auth-client';

// Sign in
const { data, error } = await authClient.signIn.email({
  email: 'user@example.com',
  password: 'password'
});

// Get current session
const session = await authClient.getSession();
```

### Component Structure
```typescript
interface ComponentProps {
  // Define props with TypeScript
}

export function Component({ ...props }: ComponentProps) {
  // Component implementation
}
```

### Theme-Aware Components
- Use Tailwind's dark: prefix for theme-specific styles
- Rely on CSS variables for colors when possible
- Test both light and dark modes

## Known Issues & Solutions

1. **Hydration Errors**: Fixed by proper HTML structure and suppressHydrationWarning
2. **Theme Flashing**: Prevented by proper theme provider setup
3. **Port Conflicts**: Development server auto-detects and uses port 3001

This documentation should provide sufficient context for productive development on this Next.js frontend for the MoneyMappr financial platform.