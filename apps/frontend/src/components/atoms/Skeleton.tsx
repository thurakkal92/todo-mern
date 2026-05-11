"use client";

import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <span
      className={cn("bg-surface-container-high block animate-pulse rounded", className)}
      aria-hidden="true"
    />
  );
}
