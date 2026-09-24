import type { User } from "@/schemas/UserSchema";

export interface MiddlewareContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pathname: string;
  search: string;
}

export type MiddlewareResult =
  | { type: "next" }
  | { type: "redirect"; to: string; replace?: boolean };

export type RouteMiddleware = (
  ctx: MiddlewareContext
) => MiddlewareResult | Promise<MiddlewareResult>;

export const next = (): MiddlewareResult => ({ type: "next" });

export const redirect = (to: string, replace = true): MiddlewareResult => ({
  type: "redirect",
  to,
  replace,
});

/**
 * Auth Middleware: Requires authenticated user.
 * If not authenticated, redirects to /login with redirect query param preserved.
 */
export const authMiddleware: RouteMiddleware = (ctx) => {
  if (!ctx.isAuthenticated) {
    const fullPath = `${ctx.pathname}${ctx.search}`;
    const redirectUrl =
      fullPath !== "/" && fullPath !== "/dashboard"
        ? `/login?redirect=${encodeURIComponent(fullPath)}`
        : "/login";
    return redirect(redirectUrl);
  }
  return next();
};

/**
 * Guest Middleware: For guest-only routes (e.g., /login, /register).
 * If already authenticated, redirects away to /dashboard (or previously intended URL).
 */
export const guestMiddleware: RouteMiddleware = (ctx) => {
  if (ctx.isAuthenticated) {
    const params = new URLSearchParams(ctx.search);
    const destination = params.get("redirect") || "/dashboard";
    return redirect(destination);
  }
  return next();
};

/**
 * Role Middleware: Requires the user to have one of the specified roles (e.g. 1 = USER, 2 = ADMIN).
 */
export const roleMiddleware = (allowedRoles: number[]): RouteMiddleware => {
  return (ctx) => {
    if (!ctx.isAuthenticated || !ctx.user) {
      return redirect("/login");
    }
    if (!allowedRoles.includes(ctx.user.role)) {
      return redirect("/dashboard");
    }
    return next();
  };
};
