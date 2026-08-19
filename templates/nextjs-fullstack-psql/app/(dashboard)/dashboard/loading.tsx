import { Skeleton } from "@/components/ui/skeleton";
import { BrandLogo } from "@/components/common/BrandLogo";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col animate-fade-in">
      {/* Top bar skeleton */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo />
          <span className="hidden sm:inline-block text-muted-foreground text-xs">/</span>
          <span className="hidden sm:inline-block text-xs font-medium text-foreground">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>

        {/* Status banner skeleton */}
        <Skeleton className="h-16 w-full rounded-lg" />

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </main>
    </div>
  );
}
