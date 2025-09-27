# MoneyMappr Frontend - Comprehensive Technical Documentation

This document provides complete technical documentation for the MoneyMappr frontend, covering setup, architecture, data flow, UI systems, and development patterns.

## Table of Contents

1. [Project Setup & Configuration](#project-setup--configuration)
2. [Architecture Overview](#architecture-overview)
3. [Data Flow & Retrieval System](#data-flow--retrieval-system)
4. [State Management & Synchronization](#state-management--synchronization)
5. [UI Component System](#ui-component-system)
6. [Real-time Features & SSE](#real-time-features--sse)
7. [Authentication System](#authentication-system)
8. [Routing & Navigation](#routing--navigation)
9. [Performance & Optimization](#performance--optimization)
10. [Development Workflow](#development-workflow)

---

## Project Setup & Configuration

### Initial Setup

```bash
# Clone and install dependencies
git clone <repository-url>
cd frontend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Configuration

The application requires several environment variables for proper operation:

```env
# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-development-secret-key-that-is-at-least-32-characters-long
BETTER_AUTH_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_BASE_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1

# Database Configuration (PostgreSQL for Prisma + NeonDB)
DATABASE_URL="postgresql://neondb_owner:npg_BIoKJ03uElkm@ep-lingering-smoke-adkmrmv8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Email Configuration
NEXT_PUBLIC_SUPPORT_EMAIL=support@moneymappr.com

# Environment
NODE_ENV=development
```

### Development Scripts

```bash
# Development server with Turbopack (hot reload)
npm run dev

# Production build with Turbopack optimization
npm run build

# Start production server
npm start

# ESLint linting
npm run lint

# Download blockchain logos for crypto features
npm run download-logos
npm run download-logos:force  # Force re-download
```

### Project Structure

```
frontend/
├── app/                      # Next.js 15 App Router
│   ├── api/                  # API routes and middleware
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Main application pages
│   ├── onboarding/           # User onboarding
│   └── demo/                 # Development/demo pages
├── components/               # React components
│   ├── providers/            # Context providers
│   ├── layout/               # Layout components
│   ├── ui/                   # Reusable UI components
│   ├── auth/                 # Authentication components
│   ├── crypto/               # Cryptocurrency components
│   └── accounts/             # Account management
├── lib/                      # Core application logic
│   ├── stores/               # Zustand state stores
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API service layers
│   ├── queries/              # React Query configurations
│   ├── types/                # TypeScript definitions
│   └── utils/                # Utility functions
├── public/                   # Static assets
└── scripts/                  # Build and utility scripts
```

---

## Architecture Overview

### Core Technologies

The application is built using modern React/Next.js patterns:

- **Next.js 15** with App Router and React Server Components
- **React 19** with Concurrent Features and Suspense
- **TypeScript 5** for complete type safety
- **Turbopack** for fast development builds
- **Tailwind CSS 4** for utility-first styling

### Component Architecture

The application follows a hierarchical component structure:

```typescript
// Root Layout (app/layout.tsx)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <Providers>
          {children}
          <GlobalDocks />
        </Providers>
      </body>
    </html>
  );
}

// Provider Hierarchy (components/providers/providers.tsx)
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GlobalErrorHandler>
      <ErrorBoundary>
        <AuthProvider>
          <LoadingProvider>
            <QueryProvider>
              <ThemeProvider>
                <CurrencyProvider>
                  <StoreProvider>
                    <RealtimeSyncProvider>
                      <SubscriptionProvider>
                        <ViewModeProvider>
                          <AccountProvider>
                            <DockProvider>
                              <OnboardingGuard>
                                {children}
                                <SessionTimeoutModal />
                              </OnboardingGuard>
                            </DockProvider>
                          </AccountProvider>
                        </ViewModeProvider>
                      </SubscriptionProvider>
                    </RealtimeSyncProvider>
                  </StoreProvider>
                </CurrencyProvider>
              </ThemeProvider>
            </QueryProvider>
          </LoadingProvider>
        </AuthProvider>
      </ErrorBoundary>
    </GlobalErrorHandler>
  );
}
```

### Layout System

The application uses a responsive layout system with multiple modes:

```typescript
// MainLayout component supports different view modes
export function MainLayout({
  children,
  showHeader = true,
  showSidebar = true
}: MainLayoutProps) {
  const { isProMode, isBeginnerMode } = useViewMode();

  // Pro mode: No sidebar, full width with header
  // Beginner mode: Sidebar with no header
  const shouldShowSidebar = showSidebar && !isProMode;
  const shouldShowHeader = showHeader && !isBeginnerMode;

  if (!shouldShowSidebar) {
    return (
      <div className="min-h-screen">
        {shouldShowHeader && <Header />}
        <div className={cn(
          "h-full px-4 py-6",
          isProMode ? "max-w-7xl mx-auto" : "max-w-3xl mx-auto"
        )}>
          {children}
        </div>
      </div>
    );
  }

  // Standard layout with sidebar
  return (
    <div className="min-h-screen">
      {shouldShowHeader && <Header />}
      <div className={shouldShowHeader ? "h-[calc(100vh-theme(spacing.16))]" : "h-screen"}>
        <SidebarLayout>
          {children}
        </SidebarLayout>
      </div>
    </div>
  );
}
```

---

## Data Flow & Retrieval System

### Data Architecture Overview

The application uses a sophisticated data management system combining multiple layers:

1. **API Client Layer** - Centralized HTTP client with error handling
2. **Service Layer** - Business logic and API abstraction
3. **Query Layer** - React Query for server state management
4. **Store Layer** - Zustand for client state
5. **Hook Layer** - Custom hooks for component integration

### API Client Implementation

```typescript
// lib/api-client.ts
class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private consecutiveFailures: number = 0;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      try {
        const { getSession } = await import('@/lib/auth-client');
        const result = await getSession();

        if (result && typeof result === 'object') {
          if ('data' in result && result.data?.session?.token) {
            return result.data.session.token;
          }
          if ('session' in result && result.session?.token) {
            return result.session.token;
          }
        }
        return null;
      } catch {
        return this.token;
      }
    }
    return this.token;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = await this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.getHeaders();

      const response = await fetch(url, {
        headers,
        credentials: 'include',
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          throw {
            response,
            message: 'Authentication required',
            code: 'UNAUTHORIZED',
            details: data,
          };
        }

        if (response.status === 404) {
          throw {
            response,
            message: 'Feature not yet available',
            code: 'NOT_IMPLEMENTED',
            details: data,
          };
        }

        throw {
          response,
          message: data.error?.message || 'Request failed',
          details: data,
        };
      }

      this.consecutiveFailures = 0;
      return data as ApiResponse<T>;
    } catch (error) {
      const authError = this.handleError(error);
      return {
        success: false,
        error: {
          code: authError.code,
          message: authError.message,
          details: authError.details,
        },
      };
    }
  }

  // HTTP method helpers
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Server-Sent Events support
  async createEventSource(endpoint: string, options?: {
    withCredentials?: boolean;
    onOpen?: () => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
  }): Promise<EventSource> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    const eventSource = new EventSource(url.toString(), {
      withCredentials: true
    });

    if (options?.onOpen) eventSource.onopen = options.onOpen;
    if (options?.onMessage) eventSource.onmessage = options.onMessage;
    if (options?.onError) eventSource.onerror = options.onError;

    return eventSource;
  }
}

export const apiClient = new ApiClient();
```

### Service Layer Implementation

```typescript
// lib/services/crypto-api.ts
class CryptoApiService {
  private readonly basePath = '/crypto';

  async getWallets(): Promise<ApiResponse<CryptoWallet[]>> {
    return apiClient.get(`${this.basePath}/wallets`);
  }

  async getWallet(walletId: string, timeRange: string = '24h'): Promise<ApiResponse<CryptoWallet>> {
    return apiClient.get(`${this.basePath}/wallets/${walletId}?timeRange=${timeRange}`);
  }

  async createWallet(walletData: CreateWalletRequest): Promise<ApiResponse<CryptoWallet>> {
    return apiClient.post(`${this.basePath}/wallets`, walletData);
  }

  async syncWallet(walletId: string, syncData: SyncRequest = {}): Promise<ApiResponse<{ jobId: string }>> {
    return apiClient.post(`${this.basePath}/wallets/${walletId}/sync`, syncData);
  }

  async getPortfolio(params: PortfolioParams = {}): Promise<ApiResponse<PortfolioData>> {
    const searchParams = new URLSearchParams();

    if (params.timeRange) searchParams.set('timeRange', params.timeRange);
    if (params.includeNFTs !== undefined) searchParams.set('includeNFTs', params.includeNFTs.toString());
    if (params.includeDeFi !== undefined) searchParams.set('includeDeFi', params.includeDeFi.toString());

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/portfolio${query ? `?${query}` : ''}`);
  }

  // Utility method for comprehensive wallet data
  async getWalletSummary(walletId: string): Promise<ApiResponse<{
    wallet: CryptoWallet;
    transactions: CryptoTransaction[];
    nfts: CryptoNFT[];
    defiPositions: DeFiPosition[];
  }>> {
    try {
      const [walletResponse, transactionsResponse, nftsResponse, defiResponse] = await Promise.all([
        this.getWallet(walletId),
        this.getWalletTransactions(walletId, { limit: 20 }),
        this.getWalletNFTs(walletId, { limit: 20 }),
        this.getWalletDeFiPositions(walletId)
      ]);

      if (!walletResponse.success) {
        return walletResponse as ApiResponse<any>;
      }

      return {
        success: true,
        data: {
          wallet: walletResponse.data,
          transactions: transactionsResponse.success ? transactionsResponse.data : [],
          nfts: nftsResponse.success ? nftsResponse.data : [],
          defiPositions: defiResponse.success ? defiResponse.data : []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: 'Failed to fetch wallet summary',
          details: error
        }
      };
    }
  }
}

export const cryptoApi = new CryptoApiService();
```

### React Query Integration

```typescript
// lib/queries/crypto-queries.ts
export const cryptoQueries = {
  // Wallet queries with optimized caching
  wallet: (id: string, timeRange = '24h') => ({
    queryKey: cryptoKeys.wallet(id, timeRange),
    queryFn: () => cryptoApi.getWallet(id, timeRange),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes - keep in cache longer
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data', 'error', 'isLoading'],
    select: (data: any) => data.success ? data.data : null,
  }),

  // Portfolio with auto-refresh
  portfolio: (params?: PortfolioParams) => ({
    queryKey: cryptoKeys.portfolio(params),
    queryFn: () => cryptoApi.getPortfolio(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refresh every 5 minutes
    select: (data: any) => data.success ? data.data : null,
  }),

  // Infinite transactions for pagination
  infiniteTransactions: (params?: Omit<TransactionParams, 'page'>) => ({
    queryKey: [...cryptoKeys.transactions(params), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      cryptoApi.getTransactions({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.success && lastPage.pagination?.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 3,
    select: (data: any) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      transactions: data.pages.flatMap((page: any) =>
        page.success ? page.data : []
      ),
    }),
  }),
};

// Mutation with comprehensive cache management
export const cryptoMutations = {
  useCreateWallet: () => {
    const queryClient = useQueryClient();
    const { addWallet } = useCryptoStore();

    return useMutation({
      mutationFn: async (data: CreateWalletRequest) => {
        const response = await cryptoApi.createWallet(data);
        if (!response.success) {
          throw response; // Preserve full error structure
        }
        return response;
      },
      onSuccess: (response) => {
        if (response.success) {
          // Update Zustand store
          addWallet(response.data);

          // Comprehensive cache invalidation
          queryClient.invalidateQueries({ queryKey: cryptoKeys.wallets() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.portfolio() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.analytics() });
        }
      },
    });
  },
};
```

### Custom Hooks for Data Integration

```typescript
// lib/hooks/use-crypto.ts
export const useWallet = (walletId: string, timeRange = '24h') => {
  const { user, loading: authLoading } = useAuth();
  const isAuthReady = !!user && !authLoading;

  // Memoize query configuration to prevent unnecessary re-renders
  const queryConfig = useMemo(() => ({
    ...cryptoQueries.wallet(walletId, timeRange),
    enabled: isAuthReady && !!walletId,
  }), [walletId, timeRange, isAuthReady]);

  const query = useQuery(queryConfig);

  return useMemo(() => ({
    wallet: query.data,
    isLoading: query.isLoading || authLoading,
    error: query.error,
    refetch: query.refetch,
  }), [query.data, query.isLoading, query.error, query.refetch, authLoading]);
};

// Comprehensive wallet data hook with performance optimization
export const useWalletFullData = (walletId: string) => {
  const { user, loading: authLoading } = useAuth();

  // Early returns with memoized objects for invalid cases
  if (walletId === 'add' || !walletId) {
    return useMemo(() => ({
      wallet: null,
      transactions: [],
      nfts: [],
      defiPositions: [],
      isLoading: false,
      error: null,
      refetch: () => {},
    }), []);
  }

  if (!user || authLoading) {
    return useMemo(() => ({
      wallet: null,
      transactions: [],
      nfts: [],
      defiPositions: [],
      isLoading: authLoading,
      error: null,
      refetch: () => {},
    }), [authLoading]);
  }

  const walletQuery = useWallet(walletId);

  // Memoize derived data to prevent recalculations
  const derivedData = useMemo(() => ({
    transactions: walletQuery?.wallet?.transactions?.length > 0 ? walletQuery.wallet.transactions : null,
    nfts: walletQuery?.wallet?.nfts?.length > 0 ? walletQuery.wallet.nfts : null,
    defiPositions: walletQuery?.wallet?.defiPositions?.length > 0 ? walletQuery.wallet.defiPositions : null,
  }), [walletQuery?.wallet]);

  const refetch = useCallback(() => {
    walletQuery.refetch();
  }, [walletQuery.refetch]);

  return useMemo(() => ({
    wallet: walletQuery.wallet,
    transactions: derivedData.transactions,
    nfts: derivedData.nfts,
    defiPositions: derivedData.defiPositions,
    isLoading: walletQuery.isLoading,
    error: walletQuery.error,
    refetch,
  }), [walletQuery.wallet, walletQuery.isLoading, walletQuery.error, derivedData, refetch]);
};
```

---

## State Management & Synchronization

### Zustand Store Architecture

The application uses multiple specialized Zustand stores for different domains:

#### Authentication Store

```typescript
// lib/stores/auth-store.ts
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
  isInitialized: boolean;
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
  sessionTimeout: number;
  autoLogoutTimer: NodeJS.Timeout | null;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        login: async (email, password) => {
          set((state) => {
            state.loginLoading = true;
            state.loginError = null;
          }, false, 'login/loading');

          try {
            const result = await signIn.email({ email, password });

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

              get().updateLastLoginDate();
              get().startAutoLogoutTimer();
            }
          } catch (error) {
            const appError = errorHandler.handleError(error, 'auth-login');
            set((state) => {
              state.loginError = appError.userMessage;
              state.loginLoading = false;
            }, false, 'login/error');
            throw error;
          }
        },

        // Session management with auto-logout
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

        updateLastActivity: () => {
          set((state) => {
            state.lastActivity = new Date();
          }, false, 'updateLastActivity');

          if (get().isAuthenticated) {
            get().startAutoLogoutTimer();
          }
        },
      })),
      {
        name: 'auth-store',
        partialize: (state) => ({
          preferences: state.preferences,
          sessionTimeout: state.sessionTimeout,
          lastLoginDate: state.lastLoginDate,
        }),
      }
    )
  )
);
```

#### Cryptocurrency Store

```typescript
// lib/stores/crypto-store.ts
interface CryptoState {
  // Wallets
  wallets: CryptoWallet[];
  selectedWallet: CryptoWallet | null;
  walletsLoading: boolean;
  walletsError: string | null;

  // Portfolio
  portfolio: PortfolioData | null;
  portfolioLoading: boolean;
  portfolioError: string | null;
  portfolioTimeRange: '1h' | '24h' | '7d' | '30d' | '1y';

  // Real-time sync state
  realtimeSyncStates: Record<string, {
    progress: number;
    status: 'queued' | 'syncing' | 'syncing_assets' | 'syncing_transactions' | 'syncing_nfts' | 'syncing_defi' | 'completed' | 'failed';
    message?: string;
    error?: string;
    startedAt?: Date;
    completedAt?: Date;
    syncedData?: string[];
  }>;
  realtimeSyncConnected: boolean;
  realtimeSyncError: string | null;

  // View preferences
  viewPreferences: {
    walletsView: 'grid' | 'list';
    transactionsView: 'detailed' | 'compact';
    portfolioChartType: 'area' | 'line' | 'bar';
    showTestnets: boolean;
    hideDustAssets: boolean;
    dustThreshold: number;
  };
}

export const useCryptoStore = create<CryptoStore>()(
  devtools(
    immer((set) => ({
      ...initialState,

      // Real-time sync management
      updateRealtimeSyncProgress: (walletId, progress, status, message) =>
        set((state) => {
          if (!state.realtimeSyncStates[walletId]) {
            state.realtimeSyncStates[walletId] = {
              progress: 0,
              status: 'queued'
            };
          }
          state.realtimeSyncStates[walletId].progress = progress;
          state.realtimeSyncStates[walletId].status = status;
          if (message) {
            state.realtimeSyncStates[walletId].message = message;
          }
          if (status === 'syncing' && !state.realtimeSyncStates[walletId].startedAt) {
            state.realtimeSyncStates[walletId].startedAt = new Date();
          }
        }, false, 'updateRealtimeSyncProgress'),

      completeRealtimeSync: (walletId, syncedData) =>
        set((state) => {
          if (state.realtimeSyncStates[walletId]) {
            state.realtimeSyncStates[walletId].progress = 100;
            state.realtimeSyncStates[walletId].status = 'completed';
            state.realtimeSyncStates[walletId].completedAt = new Date();
            if (syncedData) {
              state.realtimeSyncStates[walletId].syncedData = syncedData;
            }
          }
        }, false, 'completeRealtimeSync'),
    }))
  )
);

// Selectors for filtered data
export const selectFilteredWallets = (state: CryptoStore) => {
  const { wallets, filters, viewPreferences } = state;

  return wallets.filter((wallet) => {
    // Filter by networks
    if (filters.networks.length > 0 && !filters.networks.includes(wallet.network)) {
      return false;
    }

    // Hide testnets if preference is set
    if (!viewPreferences.showTestnets && isTestnet(wallet.network)) {
      return false;
    }

    // Hide dust assets if preference is set
    if (viewPreferences.hideDustAssets &&
        parseFloat(wallet.totalBalanceUsd) < viewPreferences.dustThreshold) {
      return false;
    }

    return true;
  });
};
```

### State Synchronization Patterns

#### React Query + Zustand Integration

```typescript
// Pattern: Sync server state to client store
export const useWallets = () => {
  const {
    wallets,
    walletsLoading,
    walletsError,
    setWallets,
    setWalletsLoading,
    setWalletsError,
  } = useCryptoStore();

  const { user, loading: authLoading } = useAuth();
  const isAuthReady = !!user && !authLoading;

  const query = useQuery({
    ...cryptoQueries.wallets(),
    enabled: isAuthReady,
  });

  // Sync React Query state to Zustand store
  useEffect(() => {
    if (query.data) {
      setWallets(query.data);
      setWalletsError(null);
    }
    if (query.error) {
      setWalletsError((query.error as any).message);
    }
  }, [query.data, query.error, setWallets, setWalletsError]);

  useEffect(() => {
    setWalletsLoading(query.isLoading);
  }, [query.isLoading, setWalletsLoading]);

  return {
    wallets,
    isLoading: walletsLoading,
    error: walletsError,
    refetch: query.refetch,
  };
};
```

#### Context + Store Integration

```typescript
// lib/contexts/AuthContext.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    session,
    isAuthenticated,
    loading,
    initializeAuth,
    updateLastActivity,
  } = useAuthStore();

  useEffect(() => {
    // Initialize auth on app start
    initializeAuth();
  }, [initializeAuth]);

  // Update activity on user interactions
  useEffect(() => {
    const handleActivity = () => {
      if (isAuthenticated) {
        updateLastActivity();
      }
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [isAuthenticated, updateLastActivity]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## UI Component System

### Design System Architecture

The UI system is built on a foundation of design tokens and component variants:

#### Component Variant System

```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
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
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### Advanced Data Table Component

```typescript
// components/ui/data-table.tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchable?: boolean;
  searchColumn?: string;
  filterable?: boolean;
  loading?: boolean;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchable = true,
  filterable = true,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        {searchable && (
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
            leftIcon={<Search className="size-4" />}
            clearable
          />
        )}

        {/* Column Visibility Toggle */}
        {filterable && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Selection Actions */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <Badge variant="secondary">
            {Object.keys(rowSelection).length} selected
          </Badge>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Export selected</Button>
            <Button variant="destructive" size="sm">Delete selected</Button>
          </div>
        </div>
      )}

      {/* Table with Loading States */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-6 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-8 w-[70px] rounded border bg-background px-2 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>{pageSize}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for common table patterns
export const sortableHeader = (title: string) => ({ column }: any) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="h-auto p-0 font-semibold hover:bg-transparent"
  >
    {title}
    <ArrowUpDown className="ml-2 size-3" />
  </Button>
);

export const actionsCell = (onEdit?: (id: string) => void, onDelete?: (id: string) => void) =>
  ({ row }: any) => {
    const id = row.original.id;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
            Copy ID
          </DropdownMenuItem>
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(id)}>Edit</DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={() => onDelete(id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
```

#### Form System with React Hook Form

```typescript
// components/ui/form.tsx
const Form = FormProvider;

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}
```

### Layout Components

#### Dashboard Layout System

```typescript
// components/layouts/dashboard-layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  navigation: NavigationItem[];
  user?: User;
  notifications?: Notification[];
  headerContent?: React.ReactNode;
  onUserMenuAction?: (action: string) => void;
  headerVariant?: 'default' | 'floating' | 'minimal';
  contentPadding?: 'none' | 'sm' | 'default' | 'lg';
  showBreadcrumbs?: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function DashboardLayout({
  children,
  navigation,
  user,
  notifications = [],
  headerContent,
  onUserMenuAction,
  headerVariant = "default",
  contentPadding = "default",
  showBreadcrumbs = false,
  breadcrumbs = [],
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultCollapsed={false} collapsible={true}>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar variant="default" size="default">
          <SidebarHeader showToggle={true}>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-semibold">MoneyMappr</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarNav items={navigation} />
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader
            variant={headerVariant}
            user={user}
            notifications={notifications}
            onUserMenuAction={onUserMenuAction}
            showBreadcrumbs={showBreadcrumbs}
            breadcrumbs={breadcrumbs}
          >
            {headerContent}
          </DashboardHeader>

          <main className={cn(mainContentVariants({ padding: contentPadding }))}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
```

---

## Real-time Features & SSE

### Server-Sent Events Implementation

The application implements comprehensive real-time features using Server-Sent Events for wallet synchronization and live updates.

#### SSE Connection Manager

```typescript
// lib/hooks/use-realtime-sync.tsx
export class MultiWalletSyncTracker {
  private eventSource: EventSource | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private isClosing: boolean = false;

  constructor(
    private onProgress: (walletId: string, progress: WalletSyncProgress) => void,
    private onComplete: (walletId: string, result: { syncedData?: string[]; completedAt?: Date }) => void,
    private onError: (error: string) => void,
    private onConnectionChange: (connected: boolean) => void
  ) {}

  async startTracking(): void {
    if (this.isClosing) return;

    try {
      const url = `${this.API_BASE}/crypto/user/sync/stream`;

      // Get auth token for SSE connection
      const session = selectSession(useAuthStore.getState());
      const token = session?.token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      // Create EventSource with credentials
      this.eventSource = new EventSource(url, {
        withCredentials: true
      });

      this.eventSource.onopen = () => {
        console.log('SSE: Connection established');
        this.onConnectionChange(true);
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleSSEMessage(data);
        } catch (error) {
          console.error('SSE: Failed to parse message:', error);
        }
      };

      this.eventSource.onerror = () => {
        console.log('SSE: Connection error');
        this.onConnectionChange(false);
        this.cleanup();

        if (!this.isClosing && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

    } catch (error) {
      this.onConnectionChange(false);
      this.onError(error instanceof Error ? error.message : 'SSE connection failed');
      this.scheduleReconnect();
    }
  }

  private handleSSEMessage(data: {
    type: string;
    walletId?: string;
    progress?: number;
    status?: string;
    message?: string;
    error?: string;
    syncedData?: string[];
    completedAt?: string;
  }): void {
    switch (data.type) {
      case 'connection_established':
        console.log('SSE: Connection confirmed');
        break;

      case 'wallet_sync_progress':
        if (data.walletId && data.progress !== undefined && data.status) {
          const progressData: WalletSyncProgress = {
            walletId: data.walletId,
            progress: data.progress,
            status: data.status as WalletSyncProgress['status'],
            message: data.message,
            error: data.error,
            completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
            syncedData: data.syncedData
          };

          this.onProgress(data.walletId, progressData);
        }
        break;

      case 'wallet_sync_completed':
        if (data.walletId) {
          this.onComplete(data.walletId, {
            syncedData: data.syncedData,
            completedAt: data.completedAt ? new Date(data.completedAt) : new Date()
          });
        }
        break;

      case 'wallet_sync_failed':
        if (data.walletId) {
          const errorMsg = data.error || 'Unknown error';
          this.onError(`Wallet sync failed: ${errorMsg}`);

          // Update progress state to failed
          this.onProgress(data.walletId, {
            walletId: data.walletId,
            progress: 0,
            status: 'failed',
            error: errorMsg,
            completedAt: new Date()
          });
        }
        break;

      case 'heartbeat':
        // Reset heartbeat timeout for connection health
        if (this.heartbeatTimeout) {
          clearTimeout(this.heartbeatTimeout);
        }

        this.heartbeatTimeout = setTimeout(() => {
          this.onConnectionChange(false);
        }, 45000); // 45 seconds timeout
        break;

      default:
        console.warn('SSE: Unknown message type:', data.type);
    }
  }

  private scheduleReconnect(): void {
    if (this.isClosing || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;
    const baseDelay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    const jitter = Math.random() * 1000;
    const delay = baseDelay + jitter;

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isClosing) {
        this.startTracking();
      }
    }, delay);
  }

  stopTracking(): void {
    this.isClosing = true;
    this.cleanup();
  }

  private cleanup(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }

    if (this.eventSource) {
      try {
        this.eventSource.onopen = null;
        this.eventSource.onmessage = null;
        this.eventSource.onerror = null;

        if (this.eventSource.readyState !== EventSource.CLOSED) {
          this.eventSource.close();
        }
      } catch (error) {
        console.warn('SSE: Error closing connection:', error);
      }
      this.eventSource = null;
    }

    this.onConnectionChange(false);
  }
}
```

#### React Hook Integration

```typescript
// React Hook for SSE management
export function useWalletSyncProgress() {
  const cryptoStore = useCryptoStore();
  const { isAuthenticated } = useAuthStore();

  const handleProgress = useCallback((walletId: string, progress: WalletSyncProgress) => {
    if (progress.status === 'failed' && progress.error) {
      cryptoStore.failRealtimeSync(walletId, progress.error);
    } else {
      cryptoStore.updateRealtimeSyncProgress(
        walletId,
        progress.progress,
        progress.status,
        progress.message
      );
    }
  }, [cryptoStore]);

  const handleComplete = useCallback((walletId: string, result: { syncedData?: string[] }) => {
    cryptoStore.completeRealtimeSync(walletId, result.syncedData);
    // Trigger data refresh
    refreshWalletData(walletId);
  }, [cryptoStore]);

  const handleError = useCallback((errorMsg: string) => {
    cryptoStore.setRealtimeSyncError(errorMsg);
  }, [cryptoStore]);

  const handleConnectionChange = useCallback((connected: boolean) => {
    cryptoStore.setRealtimeSyncConnected(connected);
  }, [cryptoStore]);

  const trackerRef = useRef<MultiWalletSyncTracker | null>(null);

  useEffect(() => {
    // Only start tracking if user is authenticated
    if (!isAuthenticated) return;

    // Prevent multiple simultaneous trackers
    if (trackerRef.current) {
      trackerRef.current.stopTracking();
    }

    const tracker = new MultiWalletSyncTracker(
      handleProgress,
      handleComplete,
      handleError,
      handleConnectionChange
    );

    trackerRef.current = tracker;
    tracker.startTracking();

    return () => {
      if (trackerRef.current) {
        trackerRef.current.stopTracking();
        trackerRef.current = null;
      }
    };
  }, [isAuthenticated, handleProgress, handleComplete, handleError, handleConnectionChange]);

  return {
    walletStates: cryptoStore.realtimeSyncStates,
    isConnected: cryptoStore.realtimeSyncConnected,
    error: cryptoStore.realtimeSyncError,
    resetConnection: () => trackerRef.current?.resetConnection(),
  };
}
```

#### Provider Integration

```typescript
// components/providers/realtime-sync-provider.tsx
export function RealtimeSyncProvider({ children }: { children: ReactNode }) {
  const { isConnected, error, walletStates, resetConnection } = useWalletSyncProgress();

  return (
    <RealtimeSyncContext.Provider value={{
      isConnected,
      error,
      walletStates,
      resetConnection
    }}>
      {children}
    </RealtimeSyncContext.Provider>
  );
}

export const useRealtimeSync = () => {
  const context = useContext(RealtimeSyncContext);
  if (context === undefined) {
    throw new Error('useRealtimeSync must be used within a RealtimeSyncProvider');
  }
  return context;
};
```

---

## Authentication System

### Better Auth Integration

The application uses Better Auth for modern, secure authentication with session management.

#### Authentication Configuration

```typescript
// lib/auth-config.ts
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      logger.info("Reset password email sent", { email: user.email });
    },
    sendVerificationEmail: async ({ user, url }) => {
      logger.info("Verification email sent", { email: user.email });
    },
    autoSignIn: false, // Require email verification
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  user: {
    additionalFields: {
      firstName: { type: "string", required: false, input: true },
      lastName: { type: "string", required: false, input: true },
      role: { type: "string", defaultValue: "USER", input: false },
      currentPlan: { type: "string", defaultValue: "FREE", input: false },
      status: { type: "string", defaultValue: "PENDING_VERIFICATION", input: false },
      currency: { type: "string", defaultValue: "USD", input: true },
      timezone: { type: "string", defaultValue: "UTC", input: true },
    },
  },

  rateLimit: {
    window: 60, // 1 minute
    max: process.env.NODE_ENV === "production" ? 50 : 100,
    storage: "memory",
  },

  cookies: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  },

  csrf: {
    enabled: true,
    cookieName: "better-auth.csrf-token",
  },
});
```

#### Route Protection

```typescript
// components/auth/AuthGuard.tsx
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}

// components/auth/onboarding-guard.tsx
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { hasCompletedOnboarding } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user && !hasCompletedOnboarding) {
      router.push('/onboarding');
    }
  }, [isAuthenticated, user, hasCompletedOnboarding, router]);

  // Show onboarding if not completed
  if (isAuthenticated && user && !hasCompletedOnboarding) {
    return null; // Will redirect to onboarding
  }

  return <>{children}</>;
}
```

#### Session Management

```typescript
// Session timeout and activity tracking
export function useSessionTimeout() {
  const {
    isAuthenticated,
    sessionTimeout,
    updateLastActivity,
    logout,
    isSessionExpired
  } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    let activityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimers = () => {
      clearTimeout(activityTimer);
      clearTimeout(warningTimer);

      // Show warning 5 minutes before timeout
      const warningTime = (sessionTimeout - 5) * 60 * 1000;
      warningTimer = setTimeout(() => {
        // Show session timeout warning
        toast.warning('Your session will expire in 5 minutes', {
          action: {
            label: 'Extend Session',
            onClick: () => updateLastActivity(),
          },
        });
      }, warningTime);

      // Auto logout at timeout
      activityTimer = setTimeout(() => {
        if (isSessionExpired()) {
          logout();
          toast.error('Session expired. Please login again.');
        }
      }, sessionTimeout * 60 * 1000);
    };

    const handleActivity = () => {
      updateLastActivity();
      resetTimers();
    };

    // Activity event listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetTimers();

    return () => {
      clearTimeout(activityTimer);
      clearTimeout(warningTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, sessionTimeout, updateLastActivity, logout, isSessionExpired]);
}
```

---

## Routing & Navigation

### Next.js App Router Structure

The application uses Next.js 15 App Router with a sophisticated routing structure:

```
app/
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Landing page
├── api/                          # API routes
│   ├── auth/[...all]/route.ts   # Better Auth endpoints
│   ├── waitlist/route.ts        # Waitlist management
│   └── v1/                      # API v1 endpoints
├── auth/                        # Authentication pages
│   ├── login/page.tsx           # Login form
│   ├── signup/page.tsx          # Registration form
│   ├── verify-email/page.tsx    # Email verification
│   ├── forgot-password/page.tsx # Password reset request
│   └── reset-password/page.tsx  # Password reset form
├── dashboard/                   # Protected dashboard
│   ├── layout.tsx              # Dashboard layout with auth guard
│   ├── page.tsx                # Dashboard overview
│   ├── accounts/               # Account management
│   │   ├── page.tsx           # Account list
│   │   ├── bank/page.tsx      # Bank account integration
│   │   ├── exchange/page.tsx  # Exchange connections
│   │   ├── wallet/            # Crypto wallet management
│   │   │   ├── page.tsx       # Wallet list
│   │   │   ├── add/page.tsx   # Add wallet wizard
│   │   │   └── [wallet]/page.tsx # Individual wallet
│   │   └── groups/            # Account grouping
│   │       ├── page.tsx       # Group management
│   │       └── [groupId]/page.tsx # Group details
│   ├── crypto/                # Cryptocurrency features
│   │   ├── page.tsx          # Crypto overview
│   │   └── wallets/          # Wallet management
│   │       ├── page.tsx      # Wallet list
│   │       ├── add/page.tsx  # Add wallet
│   │       └── [wallet]/page.tsx # Wallet details
│   ├── settings/             # User settings
│   │   ├── page.tsx         # Settings overview
│   │   ├── onboarding/page.tsx # Onboarding settings
│   │   └── import-export/page.tsx # Data management
│   ├── profile/page.tsx      # User profile
│   └── subscription/page.tsx # Subscription management
├── onboarding/               # User onboarding flow
│   └── page.tsx             # Onboarding wizard
└── demo/                    # Demo/development pages
    ├── page.tsx            # Demo overview
    ├── wallet/page.tsx     # Wallet demo
    ├── dock/page.tsx       # Dock demo
    └── sync/page.tsx       # Sync demo
```

### Navigation System

#### Dynamic Navigation Configuration

```typescript
// Navigation configuration with role-based access
const navigationConfig = {
  main: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Financial overview and insights',
    },
    {
      title: 'Crypto Wallets',
      href: '/dashboard/crypto/wallets',
      icon: Wallet,
      description: 'Manage cryptocurrency portfolios',
      badge: 'NEW',
    },
    {
      title: 'Accounts',
      href: '/dashboard/accounts',
      icon: CreditCard,
      description: 'Bank accounts and traditional assets',
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'Advanced financial analytics',
      disabled: true, // Coming soon
    },
  ],
  settings: [
    {
      title: 'Profile',
      href: '/dashboard/profile',
      icon: User,
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
    {
      title: 'Subscription',
      href: '/dashboard/subscription',
      icon: CreditCard,
    },
  ],
};

// Role-based navigation filtering
export function useNavigation() {
  const { user } = useAuth();

  return useMemo(() => {
    const mainNav = navigationConfig.main.filter(item => {
      // Filter based on user role/permissions
      if (item.disabled && user?.role !== 'ADMIN') {
        return false;
      }
      return true;
    });

    const settingsNav = navigationConfig.settings;

    return { mainNav, settingsNav };
  }, [user]);
}
```

#### Breadcrumb System

```typescript
// lib/hooks/use-breadcrumbs.ts
export function useBreadcrumbs() {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [];

    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Map segments to readable names
      const nameMap: Record<string, string> = {
        'dashboard': 'Dashboard',
        'accounts': 'Accounts',
        'crypto': 'Cryptocurrency',
        'wallets': 'Wallets',
        'settings': 'Settings',
        'profile': 'Profile',
        'add': 'Add New',
      };

      const name = nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

      breadcrumbs.push({
        label: name,
        href: index === segments.length - 1 ? undefined : currentPath, // Last item is not clickable
      });
    });

    return breadcrumbs;
  }, [pathname]);
}
```

### Route Guards and Middleware

#### Middleware Configuration

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/onboarding'];
  const authRoutes = ['/auth/login', '/auth/signup'];

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if route is auth-related
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Get auth token from cookies
  const authToken = request.cookies.get('better-auth.session-token')?.value;

  if (isProtectedRoute && !authToken) {
    // Redirect to login if accessing protected route without auth
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && authToken) {
    // Redirect to dashboard if accessing auth route while authenticated
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## Performance & Optimization

### React Query Optimization

```typescript
// Optimized query configuration with advanced caching
export const cryptoQueries = {
  wallet: (id: string, timeRange = '24h') => ({
    queryKey: cryptoKeys.wallet(id, timeRange),
    queryFn: () => cryptoApi.getWallet(id, timeRange),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes in cache
    refetchOnMount: false, // Only refetch if stale
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data', 'error', 'isLoading'], // Minimize re-renders
    select: (data: any) => data.success ? data.data : null,
  }),

  // Infinite query for large datasets
  infiniteTransactions: (params?: Omit<TransactionParams, 'page'>) => ({
    queryKey: [...cryptoKeys.transactions(params), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      cryptoApi.getTransactions({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.success && lastPage.pagination?.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 3,
    placeholderData: keepPreviousData, // Smooth pagination
  }),
};

// Background sync with optimistic updates
export const optimisticUpdateMutation = {
  useUpdateWallet: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, updates }: { id: string; updates: UpdateWalletRequest }) =>
        cryptoApi.updateWallet(id, updates),

      // Optimistic update
      onMutate: async ({ id, updates }) => {
        await queryClient.cancelQueries({ queryKey: cryptoKeys.wallet(id) });

        const previousWallet = queryClient.getQueryData(cryptoKeys.wallet(id));

        queryClient.setQueryData(cryptoKeys.wallet(id), (old: any) => ({
          ...old,
          ...updates,
        }));

        return { previousWallet, id };
      },

      // Rollback on error
      onError: (err, variables, context) => {
        if (context?.previousWallet) {
          queryClient.setQueryData(
            cryptoKeys.wallet(context.id),
            context.previousWallet
          );
        }
      },

      // Always refetch
      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({ queryKey: cryptoKeys.wallet(variables.id) });
      },
    });
  },
};
```

### Component Optimization

```typescript
// Memoization patterns for expensive components
export const WalletCard = React.memo(({ wallet, onSync }: WalletCardProps) => {
  const formattedBalance = useMemo(() =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(wallet.totalBalanceUsd)),
    [wallet.totalBalanceUsd]
  );

  const handleSync = useCallback(() => {
    onSync(wallet.id);
  }, [wallet.id, onSync]);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{wallet.name}</h3>
          <p className="text-sm text-muted-foreground">{wallet.address}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{formattedBalance}</p>
          <Button variant="outline" size="sm" onClick={handleSync}>
            Sync
          </Button>
        </div>
      </div>
    </Card>
  );
});

// Virtual scrolling for large lists
export function VirtualizedTransactionList({ transactions }: { transactions: Transaction[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated row height
    overscan: 5, // Render 5 extra items for smooth scrolling
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <TransactionCard transaction={transactions[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Bundle Optimization

```typescript
// Code splitting with dynamic imports
const CryptoWalletDetails = lazy(() => import('./CryptoWalletDetails'));
const AccountManagement = lazy(() => import('./AccountManagement'));

// Lazy load components with loading states
export function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<WalletDetailsSkeleton />}>
        <CryptoWalletDetails />
      </Suspense>

      <Suspense fallback={<AccountManagementSkeleton />}>
        <AccountManagement />
      </Suspense>
    </div>
  );
}

// Preload critical routes
export function useRoutePreloader() {
  const router = useRouter();

  useEffect(() => {
    // Preload critical routes when component mounts
    router.prefetch('/dashboard/crypto/wallets');
    router.prefetch('/dashboard/accounts');
  }, [router]);
}
```

---

## Development Workflow

### Environment Setup

```bash
# Development setup
git clone <repository>
cd frontend
npm install

# Environment configuration
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
```

### Code Quality Tools

```typescript
// ESLint configuration (eslint.config.mjs)
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "off",

      // React rules
      "react/prop-types": "off", // Using TypeScript
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // General rules
      "no-console": "warn",
      "prefer-const": "error",
    },
  },
];

// TypeScript configuration (tsconfig.json)
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Testing Strategy

```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletCard } from './WalletCard';

describe('WalletCard', () => {
  const mockWallet = {
    id: '1',
    name: 'Test Wallet',
    address: '0x123...abc',
    totalBalanceUsd: '1000.00',
    network: 'ethereum' as const,
  };

  it('renders wallet information correctly', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <WalletCard wallet={mockWallet} onSync={jest.fn()} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test Wallet')).toBeInTheDocument();
    expect(screen.getByText('0x123...abc')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('calls onSync when sync button is clicked', () => {
    const mockOnSync = jest.fn();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <WalletCard wallet={mockWallet} onSync={mockOnSync} />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Sync'));
    expect(mockOnSync).toHaveBeenCalledWith('1');
  });
});

// Hook testing
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().resetAuthState();
  });

  it('should handle login flow', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
  });
});
```

### Deployment Configuration

```typescript
// Next.js production configuration
const nextConfig: NextConfig = {
  devIndicators: false,

  // Image optimization
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.zerion.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.zapper.xyz',
        pathname: '/**',
      },
    ]
  },

  // Performance optimization
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

This comprehensive documentation covers all aspects of the MoneyMappr frontend architecture, from setup and configuration to advanced patterns and optimization strategies. The system demonstrates modern React/Next.js best practices with a focus on performance, type safety, and developer experience.
