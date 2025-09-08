import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { ErrorBoundary } from "./error-boundary";
import { StoreProvider } from "./store-provider";
import { ReactNode } from "react";
import { ViewModeProvider } from "@/lib/contexts/view-mode-context";
import { OnboardingGuard } from "@/components/auth/onboarding-guard";

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
            <ViewModeProvider>
              <OnboardingGuard>
                {children}
              </OnboardingGuard>
            </ViewModeProvider>
          </StoreProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}