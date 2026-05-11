"use client";

import { Skeleton } from "@/components/atoms/Skeleton";

export function TaskCardSkeleton() {
  return (
    <div className="border-outline-variant bg-surface-container-lowest p-lg rounded-lg border">
      <Skeleton className="mb-sm h-3 w-1/4" />
      <Skeleton className="mb-xs h-5 w-3/4" />
      <Skeleton className="mb-xs h-3 w-full" />
      <Skeleton className="mb-lg h-3 w-4/5" />
      <div className="border-outline-variant/50 pt-sm border-t">
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
