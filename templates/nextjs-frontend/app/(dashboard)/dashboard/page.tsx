"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import {
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Server,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo />
          <span className="hidden sm:inline-block text-muted-foreground text-xs">/</span>
          <span className="hidden sm:inline-block text-xs font-medium text-foreground">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="gap-2 text-xs text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome, {user?.name || (isLoading ? "Loading..." : "Developer")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Session is actively verified via Iron Session encrypted cookie.
            </p>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Button>
          </Link>
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
                Authenticated via HTTP-only JWT Cookie with Backend API.
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
          <Card className="border-border/60 shadow-sm">
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
                <Badge variant="outline" className="text-[10px]">
                  {user?.role || "DEVELOPER"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Security Overview */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <CardTitle className="text-base font-semibold">
                  Security State
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Zero-trust session architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Password Hash:</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  Argon2id
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Cookie Mode:</span>
                <span className="font-mono font-medium">HTTP-Only / Sealed</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">CSRF Protection:</span>
                <span className="font-mono font-medium">SameSite=Lax</span>
              </div>
            </CardContent>
          </Card>

          {/* Server Actions Card */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-base font-semibold">
                  Fullstack Engine
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Next.js 16 runtime environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Router:</span>
                <span className="font-medium">App Router (Route Handlers)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Styling:</span>
                <span className="font-medium">Tailwind CSS v4</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Components:</span>
                <span className="font-medium">shadcn/ui Vega</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
