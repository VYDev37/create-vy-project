"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatusBanner } from "@/components/dashboard/DashboardStatusBanner";
import { DashboardProfileCard } from "@/components/dashboard/DashboardProfileCard";
import { DashboardMetricsGrid } from "@/components/dashboard/DashboardMetricsGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export function DashboardClient() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                `Welcome, ${user?.name || "Developer"}`
              )}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Session is actively verified with Go Fiber backend.
            </p>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 text-xs cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Button>
          </Link>
        </div>

        <DashboardStatusBanner />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardProfileCard user={user} />
          <DashboardMetricsGrid />
        </div>
      </main>
    </div>
  );
}
