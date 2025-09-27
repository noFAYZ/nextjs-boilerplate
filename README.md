# MoneyMappr Frontend

MoneyMappr is a comprehensive financial management platform built with Next.js 15 that combines traditional banking, cryptocurrency portfolios, and investment tracking in one unified dashboard.

## 🏗️ Architecture Overview

### Core Framework
- **Next.js 15** with App Router, Turbopack, and React Server Components
- **TypeScript** for type safety and developer experience
- **Tailwind CSS 4** for utility-first styling
- **React 19** with latest features and concurrent rendering

### Key Technologies

#### Frontend Stack
- **Framework**: Next.js 15.5.2 with App Router
- **UI Library**: React 19.1.0 with Server Components
- **Styling**: Tailwind CSS 4 with PostCSS
- **Build Tool**: Turbopack for fast development and builds
- **TypeScript**: 5.x for type safety

#### State Management
- **Zustand 5.0.8** with persistence and immer middleware for client state
- **@tanstack/react-query 5.85.9** for server state management and caching
- **Context providers** for global state (auth, currency, loading, UI)

#### Authentication & Security
- **Better Auth 1.3.7** for modern authentication management
- **Comprehensive session management** with automatic timeout and refresh
- **Role-based access control** and user permission system
- **CSRF protection** and secure cookie handling

#### UI Components & Design
- **Radix UI** components for accessible, unstyled primitives
- **Custom design system** built on Radix with consistent styling
- **Lucide React** for consistent iconography
- **CVA (Class Variance Authority)** for component variant management
- **React Hook Form 7.62.0** with Zod validation

#### Data Visualization & Charts
- **Recharts 3.1.2** for financial charts and analytics
- **Custom chart components** for portfolio visualization
- **Real-time data updates** with Server-Sent Events

#### Cryptocurrency Integration
- **Zerion SDK** for multi-chain wallet tracking and DeFi data
- **Multi-network support** (Ethereum, Polygon, BSC, etc.)
- **Real-time price feeds** and portfolio valuation
- **NFT and DeFi position tracking**

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js 15 App Router pages
│   ├── api/                      # API routes and middleware
│   │   ├── auth/                 # Better Auth integration
│   │   └── v1/                   # API endpoints
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── signup/               # Registration page
│   │   ├── verify-email/         # Email verification
│   │   └── reset-password/       # Password reset
│   ├── dashboard/                # Main application dashboard
│   │   ├── accounts/             # Account management
│   │   │   ├── bank/             # Bank account integration
│   │   │   ├── exchange/         # Exchange connections
│   │   │   ├── wallet/           # Crypto wallet management
│   │   │   └── groups/           # Account grouping
│   │   ├── crypto/               # Cryptocurrency features
│   │   │   └── wallets/          # Wallet management & tracking
│   │   ├── settings/             # User preferences
│   │   └── profile/              # User profile management
│   ├── onboarding/               # User onboarding flow
│   └── demo/                     # Demo/development pages
├── components/                   # React components
│   ├── providers/                # Global providers and context
│   ├── layout/                   # Layout components
│   │   ├── app-header.tsx        # Application header with navigation
│   │   ├── app-sidebar.tsx       # Sidebar navigation
│   │   └── global-docks.tsx      # Global floating docks
│   ├── ui/                       # Reusable UI components
│   │   ├── form.tsx              # Form components with React Hook Form
│   │   ├── button.tsx            # Button variants
│   │   ├── input.tsx             # Input components
│   │   ├── data-table.tsx        # Advanced data tables
│   │   └── chart.tsx             # Chart components
│   ├── auth/                     # Authentication components
│   │   ├── AuthGuard.tsx         # Route protection
│   │   └── onboarding-guard.tsx  # Onboarding flow protection
│   ├── crypto/                   # Cryptocurrency components
│   │   ├── wallet-card.tsx       # Wallet display components
│   │   ├── transaction-card.tsx  # Transaction visualization
│   │   └── portfolio-chart.tsx   # Portfolio analytics
│   └── accounts/                 # Account management components
├── lib/                         # Core library code
│   ├── stores/                  # Zustand state stores
│   │   ├── auth-store.ts        # Authentication state
│   │   ├── crypto-store.ts      # Cryptocurrency data
│   │   └── account-groups-store.ts # Account grouping
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx      # Authentication context
│   │   ├── currency-context.tsx # Currency management
│   │   └── loading-context.tsx  # Global loading states
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-crypto.ts        # Cryptocurrency data hooks
│   │   ├── use-auth.ts          # Authentication hooks
│   │   └── use-realtime-sync.tsx # Real-time synchronization
│   ├── services/                # API services and external integrations
│   │   ├── crypto-api.ts        # Cryptocurrency API client
│   │   ├── currency-api.ts      # Currency conversion
│   │   └── user-service.ts      # User management
│   ├── queries/                 # React Query configurations
│   │   └── crypto-queries.ts    # Cryptocurrency query definitions
│   ├── types/                   # TypeScript type definitions
│   │   ├── crypto.ts            # Cryptocurrency types
│   │   ├── auth.ts              # Authentication types
│   │   └── account-groups.ts    # Account grouping types
│   ├── utils/                   # Utility functions
│   │   ├── error-handler.ts     # Centralized error handling
│   │   ├── logger.ts            # Logging utilities
│   │   └── cache-manager.ts     # Caching utilities
│   ├── api-client.ts            # Centralized API client
│   ├── auth-config.ts           # Better Auth configuration
│   └── constants/               # Application constants
├── public/                      # Static assets
│   └── blockchains/             # Blockchain logos and assets
├── scripts/                     # Build and utility scripts
└── docs/                        # Documentation
```

## 🔐 Authentication System

### Better Auth Integration
The application uses Better Auth for modern, secure authentication:

```typescript
// Authentication configuration (lib/auth-config.ts)
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // 1 day
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: false },
      lastName: { type: "string", required: false },
      role: { type: "string", defaultValue: "USER" },
      currentPlan: { type: "string", defaultValue: "FREE" }
    }
  }
});
```

### Authentication State Management
Zustand store handles authentication state with persistence:

```typescript
// Authentication store (lib/stores/auth-store.ts)
interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  preferences: UserPreferences;
  sessionTimeout: number;
}
```

### Protected Routes
- **AuthGuard**: Protects dashboard routes requiring authentication
- **OnboardingGuard**: Ensures users complete onboarding flow
- **Role-based access**: Different permissions for USER/ADMIN/PREMIUM roles

## 🏪 State Management Architecture

### Zustand Stores
The application uses multiple specialized Zustand stores:

#### 1. Authentication Store (`auth-store.ts`)
- User session management
- Login/logout functionality
- User preferences and settings
- Session timeout handling
- Persistent user data

#### 2. Cryptocurrency Store (`crypto-store.ts`)
- Wallet management and tracking
- Portfolio data and analytics
- Transaction history
- NFT collections
- DeFi positions
- Real-time sync states
- Filtering and view preferences

#### 3. Account Groups Store (`account-groups-store.ts`)
- Account categorization and grouping
- Bulk account operations
- Group-based analytics

### React Query Integration
Server state management with comprehensive caching:

```typescript
// Query configuration (lib/queries/crypto-queries.ts)
export const cryptoQueries = {
  wallets: () => ({
    queryKey: ['crypto', 'wallets'],
    queryFn: () => cryptoApi.getWallets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }),
  portfolio: (params) => ({
    queryKey: ['crypto', 'portfolio', params],
    queryFn: () => cryptoApi.getPortfolio(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
};
```

### Context Providers
Global state management through React Context:

- **AuthContext**: Authentication state and methods
- **CurrencyContext**: Currency selection and conversion
- **LoadingContext**: Global loading states
- **ViewModeContext**: UI view preferences
- **SubscriptionContext**: User subscription and plan management

## 🌐 API Integration & Data Flow

### Centralized API Client
```typescript
// API client (lib/api-client.ts)
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Automatic token injection
    // Error handling and retry logic
    // Backend health monitoring
  }
}
```

### Server-Sent Events (SSE)
Real-time updates for cryptocurrency synchronization:

```typescript
// Real-time sync (lib/hooks/use-realtime-sync.tsx)
export const useRealtimeSync = () => {
  useEffect(() => {
    const eventSource = apiClient.createEventSource('/crypto/sync/stream', {
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        cryptoStore.updateRealtimeSyncProgress(data.walletId, data.progress, data.status);
      }
    });
  }, []);
};
```

### Data Flow Architecture
1. **Component** → Custom Hook → React Query → API Client → Backend
2. **Real-time Updates** → SSE → Store Updates → Component Re-render
3. **User Actions** → Mutation → Store Update → UI Update → Cache Invalidation

## 🎨 UI Components & Design System

### Component Architecture
Built on Radix UI primitives with custom styling:

```typescript
// Component example (components/ui/button.tsx)
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    }
  }
);
```

### Key UI Components
- **Forms**: React Hook Form integration with Zod validation
- **Data Tables**: Advanced tables with sorting, filtering, pagination
- **Charts**: Recharts integration for financial visualizations
- **Modals & Dialogs**: Accessible modal system with Radix
- **Navigation**: Responsive header and sidebar navigation
- **Loading States**: Comprehensive loading and skeleton components

### Design Tokens
- **Colors**: Semantic color system with light/dark mode support
- **Typography**: Consistent font scales and weights
- **Spacing**: 8px base grid system
- **Shadows**: Layered shadow system for depth
- **Border Radius**: Consistent corner radius scale

## 📱 Pages & Routing Structure

### Authentication Flow
- `/auth/login` - User login with email/password
- `/auth/signup` - User registration with email verification
- `/auth/verify-email` - Email verification page
- `/auth/reset-password` - Password reset functionality
- `/auth/forgot-password` - Password reset request

### Dashboard Pages
- `/dashboard` - Main dashboard overview with portfolio summary
- `/dashboard/accounts` - Account management hub
  - `/dashboard/accounts/bank` - Bank account connections
  - `/dashboard/accounts/exchange` - Exchange integrations
  - `/dashboard/accounts/wallet` - Crypto wallet management
  - `/dashboard/accounts/groups` - Account grouping and organization
- `/dashboard/crypto` - Cryptocurrency portfolio overview
  - `/dashboard/crypto/wallets` - Wallet list and management
  - `/dashboard/crypto/wallets/add` - Add new wallet wizard
  - `/dashboard/crypto/wallets/[wallet]` - Individual wallet details
- `/dashboard/settings` - User preferences and configuration
- `/dashboard/profile` - User profile management

### Onboarding & Demo
- `/onboarding` - User onboarding flow for new users
- `/demo` - Demo pages for testing UI components

### API Routes
- `/api/auth/[...all]` - Better Auth integration endpoints
- `/api/v1/crypto/*` - Cryptocurrency API endpoints
- `/api/waitlist` - Waitlist management for beta users

## 💰 Cryptocurrency Features

### Multi-Chain Wallet Support
The platform supports multiple blockchain networks through Zerion SDK integration:

```typescript
// Supported networks (lib/constants/chains.ts)
export const SUPPORTED_NETWORKS = [
  'ethereum', 'polygon', 'binance-smart-chain', 'avalanche',
  'fantom', 'arbitrum', 'optimism', 'solana'
];
```

### Wallet Management
- **Wallet Types**: EOA (Externally Owned Accounts), Smart Contracts, Hardware Wallets
- **Address Validation**: Comprehensive address validation for all supported networks
- **Balance Tracking**: Real-time balance updates and portfolio valuation
- **Transaction History**: Complete transaction history with categorization

### Portfolio Analytics
- **Portfolio Overview**: Total value, allocation by network and asset
- **Performance Tracking**: Portfolio performance over time
- **Asset Analytics**: Individual asset performance and metrics
- **Historical Data**: Price history and portfolio value tracking

### Real-Time Synchronization
```typescript
// Sync management (lib/hooks/use-crypto.ts)
export const useSyncManager = () => {
  const syncWallet = (walletId: string) => {
    return cryptoMutations.useSyncWallet().mutate({ walletId });
  };

  const hasActiveSyncs = () => {
    return Object.values(realtimeSyncStates).some(
      state => ['queued', 'syncing'].includes(state.status)
    );
  };
};
```

### DeFi Integration
- **Position Tracking**: Lending, borrowing, and liquidity positions
- **Protocol Support**: Integration with major DeFi protocols
- **Yield Farming**: Track farming positions and rewards
- **Staking**: Monitor staking positions and rewards

### NFT Support
- **Collection Management**: Track NFT collections across networks
- **Metadata Display**: Rich metadata display with images and attributes
- **Valuation**: NFT valuation and floor price tracking
- **Transfer History**: Complete NFT transfer and trading history

## 🚀 Development Workflow

### Available Scripts
```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm run start

# Linting with ESLint
npm run lint

# Download blockchain logos
npm run download-logos
```

### Environment Configuration
Required environment variables:
```env
# Authentication
BETTER_AUTH_BASE_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1

# Cryptocurrency APIs
ZERION_API_KEY=your-zerion-api-key
```

### Development Guidelines

#### Component Development
- Use functional components with TypeScript
- Implement proper error boundaries
- Follow established naming conventions
- Use custom UI components from `components/ui/`

#### State Management
- Use Zustand for client state with proper persistence
- Use React Query for server state and caching
- Keep API calls in `lib/services/` and use custom hooks
- Implement proper loading states and error handling

#### Styling
- Use Tailwind CSS utility classes
- Follow the established design system
- Use custom theme provider for consistent theming
- Implement responsive design patterns

#### API Integration
- Use centralized API client in `lib/api-client.ts`
- Implement proper error handling with error boundary system
- Use React Query for data fetching and caching
- Implement real-time updates with SSE where appropriate

## 🏗️ Build & Deployment

### Production Build
The application uses Next.js 15 with Turbopack for optimal build performance:

```typescript
// Next.js configuration (next.config.ts)
const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.zerion.io' },
      { protocol: 'https', hostname: 'images.zapper.xyz' }
    ]
  }
};
```

### Performance Optimizations
- **React Server Components** for reduced client-side JavaScript
- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **Caching strategies** with React Query and SWR patterns
- **Bundle optimization** with Turbopack

### Security Features
- **CSRF protection** with Better Auth
- **Secure session management** with HttpOnly cookies
- **Input validation** with Zod schemas
- **Rate limiting** on authentication endpoints
- **Error boundary** system for graceful error handling

## 📋 Key Features Summary

### ✅ Implemented Features
- **User Authentication** - Complete auth flow with Better Auth
- **Multi-Chain Wallet Tracking** - Support for 8+ blockchain networks
- **Real-Time Portfolio Sync** - Live updates via Server-Sent Events
- **Advanced UI Components** - Comprehensive design system
- **Responsive Design** - Mobile-first responsive layouts
- **State Management** - Zustand + React Query architecture
- **Error Handling** - Centralized error management
- **TypeScript Integration** - Full type safety throughout
- **Development Tools** - Hot reload with Turbopack

### 🔄 Development Status
- **Account Grouping** - Advanced account organization
- **Bank Integration** - Traditional banking connections
- **Advanced Analytics** - Portfolio performance analytics
- **Mobile App** - React Native companion app
- **API Documentation** - OpenAPI specification

### 🎯 Technical Highlights
- **Modern Stack**: Next.js 15, React 19, TypeScript 5
- **Performance**: Turbopack build system, React Server Components
- **Developer Experience**: Hot reload, type safety, comprehensive tooling
- **Scalability**: Modular architecture, efficient state management
- **Security**: Modern authentication, secure data handling
- **User Experience**: Responsive design, real-time updates, intuitive interface

This frontend represents a modern, scalable approach to financial application development, combining the latest web technologies with comprehensive financial management features.