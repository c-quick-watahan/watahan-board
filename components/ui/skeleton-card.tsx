import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Grid of card skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-950"
            >
              {/* Card header */}
              <div className="mb-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Card content */}
              <div className="mb-4">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Card footer */}
              <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="h-9 flex-1 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
