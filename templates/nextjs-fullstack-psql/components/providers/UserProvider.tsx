"use client";

import { useRef } from "react";
import type { User } from "@/schemas/UserSchema";
import { useAuthStore } from "@/stores/AuthStore";

interface UserProviderProps {
  initialUser?: User | null;
  children: React.ReactNode;
}

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
