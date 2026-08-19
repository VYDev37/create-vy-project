"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores/AuthStore";
import { apiClient, getApiErrorMessage } from "@/lib/ApiClient";
import type { LoginInput, RegisterInput } from "@/schemas/AuthSchema";
import { UserSchema, type User } from "@/schemas/UserSchema";
import type { ApiResponse } from "@/types";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: clearStore } =
    useAuthStore();

  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<ApiResponse<{ user: unknown; isLoggedIn: boolean }>>(
        "/api/auth/me"
      );

      if (res.data.success && res.data.data?.user) {
        const parsed = UserSchema.safeParse(res.data.data.user);
        if (parsed.success) {
          setUser(parsed.data);
          return parsed.data;
        }
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogin = useCallback(
    async (credentials: LoginInput) => {
      setLoading(true);
      try {
        const res = await apiClient.post<ApiResponse<unknown>>(
          "/api/auth/login",
          credentials
        );

        if (!res.data.success || !res.data.data) {
          throw new Error(res.data.error || "Login failed");
        }

        const parsed = UserSchema.safeParse(res.data.data);
        if (!parsed.success) {
          throw new Error("Invalid user response format received from server");
        }

        setUser(parsed.data);
        return { success: true, user: parsed.data };
      } catch (err) {
        throw new Error(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const handleRegister = useCallback(
    async (data: RegisterInput) => {
      setLoading(true);
      try {
        const res = await apiClient.post<ApiResponse<unknown>>(
          "/api/auth/register",
          data
        );

        if (!res.data.success || !res.data.data) {
          throw new Error(res.data.error || "Registration failed");
        }

        const parsed = UserSchema.safeParse(res.data.data);
        if (!parsed.success) {
          throw new Error("Invalid user response format received from server");
        }

        setUser(parsed.data);
        return { success: true, user: parsed.data };
      } catch (err) {
        throw new Error(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      // Ignore logout request errors, clear local state regardless
    } finally {
      clearStore();
      setLoading(false);
    }
  }, [clearStore, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkSession,
  };
}
