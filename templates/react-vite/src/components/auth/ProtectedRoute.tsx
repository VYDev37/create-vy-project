import { RouteGuard } from "./RouteGuard";
import { authMiddleware, type RouteMiddleware } from "@/middleware/RouteMiddleware";

interface ProtectedRouteProps {
  middlewares?: RouteMiddleware[];
  children?: React.ReactNode;
}

export function ProtectedRoute({ middlewares = [authMiddleware], children }: ProtectedRouteProps) {
  return <RouteGuard middlewares={middlewares}>{children}</RouteGuard>;
}
