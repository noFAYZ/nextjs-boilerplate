import { ThemeProvider } from "./theme-provider";

import { ErrorBoundary } from "./error-boundary";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        enableSystem
        disableTransitionOnChange
      >
    
          <AuthProvider>
            {children}
          </AuthProvider>
   
      </ThemeProvider>
    </ErrorBoundary>
  )
}