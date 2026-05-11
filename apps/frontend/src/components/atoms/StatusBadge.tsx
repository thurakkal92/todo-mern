import type { TaskStatus } from "@todo/shared";
import { cn } from "@/lib/cn";

const badgeStyle: Record<TaskStatus, string> = {
  todo: "bg-status-warning text-on-surface",
  "in-progress": "bg-status-info text-white",
  done: "bg-status-success text-white",
};

const badgeLabel: Record<TaskStatus, string> = {
  todo: "TO DO",
  "in-progress": "IN PROGRESS",
  done: "DONE",
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-sm text-label-caps inline-flex items-center rounded py-0.5 uppercase tracking-wider",
        badgeStyle[status],
        className,
      )}
    >
      {badgeLabel[status]}
    </span>
  );
}
