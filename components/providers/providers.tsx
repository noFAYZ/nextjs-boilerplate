import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { ErrorBoundary } from "./error-boundary";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/contexts/AuthContext";
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
          <AuthProvider>
            <ViewModeProvider>
              <OnboardingGuard>
                {children}
              </OnboardingGuard>
            </ViewModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}