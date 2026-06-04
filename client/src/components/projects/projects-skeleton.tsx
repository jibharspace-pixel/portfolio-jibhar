import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-2xl border border-border/60 overflow-hidden bg-card">
          <Skeleton className="w-full aspect-video" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-2/3" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-5 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
