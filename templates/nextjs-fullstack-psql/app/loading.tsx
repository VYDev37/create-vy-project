import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground animate-fade-in">
      {/* Top Navbar Skeleton */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-7 w-28 rounded-lg" />
            <div className="hidden md:flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl space-y-10">
        {/* Hero Skeleton */}
        <div className="space-y-4 text-center max-w-2xl mx-auto flex flex-col items-center">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-12 w-full max-w-xl" />
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Bento / Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <Skeleton className="h-48 md:col-span-2 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 md:col-span-2 rounded-xl" />
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t border-border/40 py-8 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </footer>
    </div>
  );
}
