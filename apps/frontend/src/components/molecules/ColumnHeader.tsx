"use client";

import type { TaskStatus } from "@todo/shared";
import { MoreHorizontal } from "lucide-react";
import { StatusDot } from "@/components/atoms/StatusDot";
import { TaskCountBadge } from "@/components/atoms/TaskCountBadge";
import { Icon } from "@/components/atoms/Icon";

const columnLabel: Record<TaskStatus, string> = {
  todo: "TO DO",
  "in-progress": "IN PROGRESS",
  done: "DONE",
};

interface ColumnHeaderProps {
  status: TaskStatus;
  count: number;
  onMenuClick?: () => void;
}

export function ColumnHeader({ status, count, onMenuClick }: ColumnHeaderProps) {
  return (
    <div className="gap-sm px-xs py-sm flex items-center">
      <StatusDot status={status} />
      <span className="text-label-caps text-on-surface-variant flex-1 uppercase tracking-widest">
        {columnLabel[status]}
      </span>
      <TaskCountBadge count={count} />
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          aria-label="Column options"
          className="p-xs text-on-surface-variant hover:text-primary rounded transition-colors"
        >
          <Icon icon={MoreHorizontal} size={20} />
        </button>
      )}
    </div>
  );
}
