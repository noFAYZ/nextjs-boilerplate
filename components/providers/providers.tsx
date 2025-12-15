import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { ErrorBoundary } from "./error-boundary";
import { StoreProvider } from "./store-provider";
import { DockProvider } from "./dock-provider";
import { PostHogProvider } from "./posthog-provider";
import { ReactNode } from "react";
import { ViewModeProvider } from "@/lib/contexts/view-mode-context";
import { OnboardingGuard } from "@/components/auth/onboarding-guard";
import { AccountProvider } from "@/lib/contexts/account-context";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { LoadingProvider } from "@/lib/contexts/loading-context";
import { SessionTimeoutModal } from "@/components/auth/session-timeout-modal";
import { CurrencyProvider } from "@/lib/contexts/currency-context";
import { GlobalErrorHandler } from "./global-error-handler";
import { OrganizationModalsProvider } from "./organization-modals-provider";
import { OrganizationDataSyncProvider } from "./organization-data-sync-provider";
import { OrganizationURLSyncProvider } from "./organization-url-sync-provider";
import { GlobalRefetchOverlay } from "@/components/organization/global-refetch-overlay";
import { RealtimeSyncProvider } from "./realtime-sync-provider";
import {  ToastProvider } from "../ui/toast";


/**
 * Global Providers
 *
 * IMPORTANT: Only include providers that are truly global and needed on every page
 * - Auth, Theme, Query Client, etc.
 *
 * DO NOT include providers that:
 * 1. Fetch data (like SubscriptionProvider) - Use TanStack Query hooks in components/pages
 * 2. Establish connections (like RealtimeSyncProvider) - Use hooks in relevant pages only
 *
 * This prevents unnecessary:
 * - API calls on every page
 * - WebSocket/SSE connections on every page
 * - Network overhead for unused features
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <PostHogProvider>
        <AuthProvider>
          <LoadingProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              themes={["light", "dark", "light-pro", "dark-pro"]}
              disableTransitionOnChange
            >
         <ToastProvider>
              <CurrencyProvider defaultCurrency="USD">
                <StoreProvider>
                <RealtimeSyncProvider>
                  <OrganizationURLSyncProvider />
                  <OrganizationDataSyncProvider />
                  <GlobalRefetchOverlay />
                  <ViewModeProvider>
                    <AccountProvider>
                      <DockProvider>
                        <OnboardingGuard>
                          {children}
                          <SessionTimeoutModal />
                          <OrganizationModalsProvider />
                        </OnboardingGuard>
                      </DockProvider>
                    </AccountProvider>
                  </ViewModeProvider>
                  </RealtimeSyncProvider>
                </StoreProvider>
              </CurrencyProvider></ToastProvider>
            </ThemeProvider>
          </QueryProvider>
        </LoadingProvider>
        </AuthProvider>
      </PostHogProvider>
    </ErrorBoundary>
  )
}