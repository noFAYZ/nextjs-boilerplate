"use client";

import { authClient } from "@/lib/auth-client";

export const useAuthSession = async () => {
  const { data: session, error } = await authClient.getSession();

  return {
    user: session?.user || null,
    session: session?.session || null,

    error: error ? String(error) : null,
    isAuthenticated: !!session?.user,
  };
};
