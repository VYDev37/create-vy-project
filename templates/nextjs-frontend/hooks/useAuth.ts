"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores/AuthStore";
import { apiClient, getApiErrorMessage } from "@/lib/ApiClient";
import type { LoginInput, RegisterInput } from "@/schemas/AuthSchema";
import { UserSchema, type User } from "@/schemas/UserSchema";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: storeLogout } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<ApiResponse<unknown>>("/users/me");
      if (res.data?.data) {
        const parsed = UserSchema.safeParse(res.data.data);
        if (parsed.success) {
          setUser(parsed.data);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (credentials: LoginInput) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        username: credentials.identifier,
        password: credentials.password,
      };

      const res = await apiClient.post<ApiResponse<{ user?: unknown; token?: string }>>("/auth/login", payload);
      const data = res.data?.data;
      if (data?.user) {
        const parsed = UserSchema.safeParse(data.user);
        if (parsed.success) {
          setUser(parsed.data);
          return parsed.data;
        }
      }
      // Fallback: fetch profile if login returns token only
      await checkSession();
      return data;
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const res = await apiClient.post<ApiResponse<{ user?: unknown; token?: string }>>("/auth/register", payload);
      const responseData = res.data?.data;
      if (responseData?.user) {
        const parsed = UserSchema.safeParse(responseData.user);
        if (parsed.success) {
          setUser(parsed.data);
          return parsed.data;
        }
      }
      await checkSession();
      return responseData;
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      await apiClient.post("/auth/logout");
    } catch (err: unknown) {
      console.warn("Logout request failed:", err);
    } finally {
      storeLogout();
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkSession,
  };
}
