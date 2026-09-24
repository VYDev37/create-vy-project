import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";
import { PageLoading } from "@/pages/loading";
import type { RouteMiddleware, MiddlewareResult } from "@/middleware/RouteMiddleware";

interface RouteGuardProps {
  middlewares?: RouteMiddleware[];
  children?: React.ReactNode;
}

export function RouteGuard({ middlewares = [], children }: RouteGuardProps) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [decision, setDecision] = useState<MiddlewareResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;

    async function evaluatePipeline() {
      if (isLoading) return;

      setIsEvaluating(true);
      const ctx = {
        user,
        isAuthenticated,
        isLoading,
        pathname: location.pathname,
        search: location.search,
      };

      for (const mw of middlewares) {
        const result = await mw(ctx);
        if (result.type === "redirect") {
          if (!isCancelled) {
            setDecision(result);
            setIsEvaluating(false);
          }
          return;
        }
      }

      if (!isCancelled) {
        setDecision({ type: "next" });
        setIsEvaluating(false);
      }
    }

    evaluatePipeline();

    return () => {
      isCancelled = true;
    };
  }, [isLoading, isAuthenticated, user, location.pathname, location.search, middlewares]);

  if (isLoading || isEvaluating) {
    return <PageLoading />;
  }

  if (decision?.type === "redirect") {
    return <Navigate to={decision.to} replace={decision.replace ?? true} />;
  }

  return children ? <>{children}</> : <Outlet />;
}
