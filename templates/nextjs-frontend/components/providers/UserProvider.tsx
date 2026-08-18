"use client";

import { useRef } from "react";
import type { User } from "@/schemas/UserSchema";
import { useAuthStore } from "@/stores/AuthStore";

interface UserProviderProps {
  initialUser?: User | null;
  children: React.ReactNode;
}

/**
 * Pure Zustand Store Hydrator
 * Injects initial server session directly into Zustand store with zero React Context overhead.
 */
export function UserProvider({ initialUser, children }: UserProviderProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    if (initialUser) {
      useAuthStore.setState({
        user: initialUser,
        isAuthenticated: true,
        isLoading: false,
      });
    }
    initialized.current = true;
  }

  return <>{children}</>;
}
