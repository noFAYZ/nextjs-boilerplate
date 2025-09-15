# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoneyMappr is a comprehensive financial management platform built with Next.js 15 that combines traditional banking, cryptocurrency portfolios, and investment tracking. The application uses a modern stack with React Server Components, TypeScript, and Tailwind CSS.

## Available Commands

```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## Architecture & Key Technologies

### Core Framework
- **Next.js 15** with App Router, Turbopack, and React Server Components
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **React 19** with latest features

### State Management
- **Zustand** with persistence and immer middleware for client state
- **@tanstack/react-query** (React Query) for server state and caching
- **Context providers** for authentication, currency, loading, and UI state

### Authentication
- **Better Auth** for authentication management
- Custom Zustand store for auth state (`lib/stores/auth-store.ts`)
- Session management with automatic timeout and refresh

### Data & API
- **Custom API client** (`lib/api-client.ts`) with error handling
- **Zerion SDK** for cryptocurrency data integration
- **Server-Sent Events (SSE)** for real-time updates
- Persistent caching system for offline functionality

### UI Components
- **Radix UI** components for accessible primitives
- **Shadcn/ui** inspired custom components
- **Recharts** for data visualization
- **Lucide React** for icons

## Project Structure

### App Directory (Next.js 15 App Router)
- `app/` - Page routes with React Server Components
- `app/dashboard/` - Main dashboard area
  - `accounts/` - Account management (banks, exchanges, wallets)
  - `crypto/` - Cryptocurrency portfolio management
  - `settings/` - User preferences and configuration
- `app/auth/` - Authentication pages (login, signup, verification)
- `app/onboarding/` - User onboarding flow

### Core Components
- `components/providers/` - Global providers (Theme, Query, Store, Auth, etc.)
- `components/layout/` - Layout components (header, docks, sidebar)
- `components/crypto/` - Cryptocurrency-specific components
- `components/ui/` - Reusable UI components (forms, tables, charts)
- `components/auth/` - Authentication-related components

### Libraries & Utilities
- `lib/stores/` - Zustand stores (auth, crypto, account groups)
- `lib/contexts/` - React contexts (currency, view mode, loading)
- `lib/hooks/` - Custom React hooks (crypto, auth, caching)
- `lib/services/` - API services (crypto, currency, zerion)
- `lib/queries/` - React Query hooks for data fetching
- `lib/types/` - TypeScript type definitions

### Data Flow Architecture
1. **Authentication**: `AuthContext` + `auth-store.ts` → Better Auth client
2. **State Management**: Zustand stores → React hooks → Components
3. **Data Fetching**: React Query → API client → Backend services
4. **Real-time Updates**: SSE → Store updates → UI reactivity

## Key Features

### Authentication System
- Complete auth flow with email/password
- Session management with automatic timeout
- Role-based access control
- Persistent user preferences

### Cryptocurrency Integration
- Multi-chain wallet tracking via Zerion SDK
- Real-time price data and portfolio valuation
- Transaction history and NFT tracking
- DeFi position monitoring
- Background sync with progress tracking

### Account Management
- Multiple account types (banks, exchanges, wallets)
- Account grouping and categorization
- Bulk operations and import/export
- Transaction categorization

### UI/UX Features
- Responsive design with mobile support
- Theme switching (light/dark modes)
- Global docks for quick access
- Loading states and error handling
- Real-time sync indicators

## Development Guidelines

### Component Patterns
- Use functional components with TypeScript
- Implement proper error boundaries
- Follow the established naming conventions
- Use the custom UI components library in `components/ui/`

### State Management
- Use Zustand for client state with proper persistence
- Use React Query for server state and caching
- Keep API calls in `lib/services/` and use custom hooks
- Implement proper loading states and error handling

### Styling
- Use Tailwind CSS classes
- Follow the established design system
- Use the custom theme provider for consistent theming
- Implement responsive design patterns

### API Integration
- Use the centralized API client in `lib/api-client.ts`
- Implement proper error handling with the error boundary system
- Use React Query for data fetching and caching
- Implement real-time updates with SSE where appropriate

## Environment Configuration

The application requires proper environment setup:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API endpoint
- Better Auth configuration
- Zerion SDK API keys

## Important Notes

- The app uses React Server Components by default
- Authentication is handled through Better Auth with custom state management
- Cryptocurrency data is fetched via Zerion SDK with custom caching
- The UI uses a combination of Radix UI primitives and custom components
- Real-time features are implemented using Server-Sent Events