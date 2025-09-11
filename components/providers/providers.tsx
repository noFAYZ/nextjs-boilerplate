import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { ErrorBoundary } from "./error-boundary";
import { StoreProvider } from "./store-provider";
import { DockProvider } from "./dock-provider";
import { AutoSyncProvider } from "./auto-sync-provider";
import { ReactNode } from "react";
import { ViewModeProvider } from "@/lib/contexts/view-mode-context";
import { OnboardingGuard } from "@/components/auth/onboarding-guard";
import { AccountProvider } from "@/lib/contexts/account-context";
import { SubscriptionProvider } from "@/lib/contexts/subscription-context";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          themes={["light", "dark", "light-pro", "dark-pro"]}
          disableTransitionOnChange
        >
          <StoreProvider>
            <SubscriptionProvider>
              <ViewModeProvider>
                <AccountProvider>
                  <DockProvider>
                    <AutoSyncProvider>
                      <OnboardingGuard>
                        {children}
                      </OnboardingGuard>
                    </AutoSyncProvider>
                  </DockProvider>
                </AccountProvider>
              </ViewModeProvider>
            </SubscriptionProvider>
          </StoreProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}