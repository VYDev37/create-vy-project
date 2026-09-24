import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/components/providers/AppProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { guestMiddleware } from "@/middleware/RouteMiddleware";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/dashboard";
import NotFoundPage from "@/pages/not-found";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Public landing page */}
            <Route path="/" element={<HomePage />} />

            {/* Guest-only routes (redirects authenticated users to /dashboard) */}
            <Route element={<RouteGuard middlewares={[guestMiddleware]} />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes (requires authenticated user) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
