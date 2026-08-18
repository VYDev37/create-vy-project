import { useEffect } from "react";
import { useAuthStore } from "@/stores/AuthStore";
import { apiClient } from "@/lib/ApiClient";
import { UserSchema } from "@/schemas/UserSchema";

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
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
  }, [setUser, setLoading]);

  return <>{children}</>;
}
