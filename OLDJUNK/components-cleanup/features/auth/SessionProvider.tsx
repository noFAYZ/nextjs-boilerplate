"use client";

import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  // Session management is now handled by AuthContext
  // This component serves as a simple wrapper
  return <>{children}</>;
}
