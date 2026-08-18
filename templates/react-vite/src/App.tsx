import { useState } from "react";
import { AppProvider } from "@/components/providers/AppProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { BentoFeatures } from "@/components/sections/BentoFeatures";
import { TechStack } from "@/components/sections/TechStack";
import { CtaSection } from "@/components/sections/CtaSection";
import { useAuthStore } from "@/stores/AuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Server,
  User as UserIcon,
  Activity,
  ArrowLeft,
  Terminal,
} from "lucide-react";

function DashboardView({ onBack }: { onBack: () => void }) {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Application Dashboard
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            React 19 + Vite 6 client connected to Go Fiber backend
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-2 text-xs h-9 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Status banner */}
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground">
              Session Active & Authenticated
            </p>
            <p className="text-[11px] text-muted-foreground">
              Authenticated via HTTP-only JWT Cookie with Go Fiber Backend API.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px] font-mono">
          {isAuthenticated ? "Authenticated" : "Guest / Loading"}
        </Badge>
      </div>

      {/* Metrics & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">
                Profile Details
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Current authenticated user state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-mono font-medium">@{user?.username || "demodev"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{user?.name || "Demo Developer"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user?.email || "demo@example.com"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Role:</span>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {user?.role || "DEVELOPER"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* API Connection Card */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">
                Backend Connection
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Go Fiber API status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Endpoint:</span>
              <span className="font-mono text-[11px]">
                {import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Auth Type:</span>
              <span className="font-medium">HTTP-only Cookie (JWT)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium">Axios Instance (withCredentials)</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">
                Client Stats
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Vite bundle performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Framework:</span>
              <span className="font-medium">React 19 + Vite 6</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Styling:</span>
              <span className="font-medium">Tailwind CSS v4</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Store:</span>
              <span className="font-medium">Zustand v5</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code snippet card */}
      <Card className="border-border/60 bg-muted/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              API Client Integration
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="p-3 rounded-md bg-background/80 border border-border/60 text-xs font-mono overflow-x-auto text-muted-foreground">
            <code>{`// src/lib/ApiClient.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  withCredentials: true,
});`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "dashboard">("home");

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Navbar onNavigate={setCurrentView} />

        <main className="flex-1">
          {currentView === "home" ? (
            <>
              <HeroSection />
              <BentoFeatures />
              <TechStack />
              <CtaSection />
            </>
          ) : (
            <DashboardView onBack={() => setCurrentView("home")} />
          )}
        </main>

        <Footer />
      </div>
    </AppProvider>
  );
}
