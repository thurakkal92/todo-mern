import type { TaskStatus } from "@todo/shared";
import { cn } from "@/lib/cn";

const dotColor: Record<TaskStatus, string> = {
  todo: "bg-status-warning",
  "in-progress": "bg-status-info",
  done: "bg-status-success",
};

interface StatusDotProps {
  status: TaskStatus;
  className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full",
        dotColor[status],
        className,
      )}
      aria-hidden="true"
    />
  );
}
