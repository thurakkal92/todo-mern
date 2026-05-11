"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, TaskStatus } from "@todo/shared";
import { CategoryLabel } from "@/components/atoms/CategoryLabel";
import { CheckCircleIcon } from "@/components/atoms/CheckCircleIcon";
import { IconButton } from "@/components/atoms/IconButton";
import { Icon } from "@/components/atoms/Icon";
import { Avatar } from "@/components/atoms/Avatar";
import { ContextMenu } from "@/components/molecules/ContextMenu";
import { useGetTasksQuery, useMoveTaskMutation } from "@/store/tasksApi";
import { useErrorToast } from "@/hooks/useErrorToast";
import { isApiError } from "@/lib/apiError";
import { cn } from "@/lib/cn";

const cardBase: Record<TaskStatus, string> = {
  todo: "bg-surface-container-lowest border border-outline-variant border-l-4 border-l-status-warning hover:border-outline",
  "in-progress":
    "bg-surface-container-lowest border border-outline-variant border-l-4 border-l-status-info shadow-sm",
  done: "bg-surface-container-low border border-outline-variant/30 border-l-4 border-l-status-success opacity-70 grayscale-[.5]",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: tasks } = useGetTasksQuery(undefined);
  const [moveTask, { error: moveError }] = useMoveTaskMutation();
  useErrorToast(isApiError(moveError) ? moveError : null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: { task },
  });

  function handleContextMove(targetStatus: TaskStatus) {
    if (!tasks) return;
    const colTasks = tasks
      .filter((t) => t.status === targetStatus)
      .sort((a, b) => a.order - b.order);
    const last = colTasks[colTasks.length - 1];
    const newOrder = last !== undefined ? last.order + 1 : 0;
    void moveTask({ id: task._id, body: { status: targetStatus, order: newOrder } });
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "p-lg group relative cursor-grab rounded-lg transition-all",
        cardBase[task.status],
        isDragging && "opacity-50",
      )}
      {...attributes}
      {...listeners}
    >
      {/* Row 1: category label + context menu trigger */}
      <div className="mb-xs flex items-center justify-between">
        <CategoryLabel>TASK</CategoryLabel>
        <div className="relative">
          <IconButton
            icon="more_vert"
            label="Card options"
            size={16}
            className="-mr-xs opacity-0 group-hover:opacity-100"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          />
          {menuOpen && (
            <ContextMenu
              status={task.status}
              onMove={handleContextMove}
              onClose={() => {
                setMenuOpen(false);
              }}
            />
          )}
        </div>
      </div>

      {/* Row 2: title */}
      <div className="mb-xs gap-xs flex items-start">
        {task.status === "done" && <CheckCircleIcon size={16} className="mt-0.5 flex-shrink-0" />}
        <h3
          className={cn(
            "text-h3 font-semibold leading-snug",
            task.status === "done" ? "text-on-surface-variant line-through" : "text-primary",
          )}
        >
          {task.title}
        </h3>
      </div>

      {/* Row 3: description */}
      {task.description && (
        <p className="mb-lg text-body-sm text-on-surface-variant line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div
        className={cn(
          "border-outline-variant/50 pt-sm flex items-center justify-between border-t",
          !task.description && "mt-lg",
        )}
      >
        <div className="gap-xs text-on-surface-variant/60 flex items-center">
          <Icon name="calendar_today" size={12} />
          <span className="font-mono text-xs">
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <Avatar name="Team Member" size="sm" />
      </div>
    </div>
  );
}
