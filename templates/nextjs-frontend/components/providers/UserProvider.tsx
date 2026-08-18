"use client";

import { useEffect, useRef } from "react";
import type { User } from "@/schemas/UserSchema";
import { UserSchema } from "@/schemas/UserSchema";
import { useAuthStore } from "@/stores/AuthStore";
import { apiClient } from "@/lib/ApiClient";

interface UserProviderProps {
  initialUser?: User | null;
  children: React.ReactNode;
}

export function UserProvider({ initialUser, children }: UserProviderProps) {
  const initialized = useRef(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

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

  useEffect(() => {
    if (initialUser) return;

    let isMounted = true;
    async function initAuth() {
      try {
        const res = await apiClient.get("/users/me");
        if (res.data?.data && isMounted) {
          const parsed = UserSchema.safeParse(res.data.data);
          if (parsed.success) {
            setUser(parsed.data);
            return;
          }
        }
        if (isMounted) setUser(null);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [initialUser, setUser, setLoading]);

  return <>{children}</>;
}
