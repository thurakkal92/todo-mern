import { cn } from "@/lib/cn";

interface TaskCountBadgeProps {
  count: number;
  className?: string;
}

export function TaskCountBadge({ count, className }: TaskCountBadgeProps) {
  return (
    <span className={cn("text-on-surface-variant/60 font-mono text-xs", className)}>{count}</span>
  );
}
