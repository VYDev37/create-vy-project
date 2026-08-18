import { Skeleton } from "@/components/ui/skeleton";

export function PageLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-6 animate-fade-in">
      <div className="space-y-3 text-center max-w-md w-full flex flex-col items-center">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl pt-4">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
    </div>
  );
}
