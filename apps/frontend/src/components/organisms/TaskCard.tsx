"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, Calendar, Pencil, Trash2 } from "lucide-react";
import type { Task, TaskStatus } from "@todo/shared";
import { IconButton } from "@/components/atoms/IconButton";
import { Icon } from "@/components/atoms/Icon";
import { TaskCreationModal } from "./TaskCreationModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { useDeleteTaskMutation } from "@/store/tasksApi";
import { useErrorToast } from "@/hooks/useErrorToast";
import { isApiError } from "@/lib/apiError";
import { cn } from "@/lib/cn";

const cardBase: Record<TaskStatus, string> = {
  todo: "bg-surface-container-lowest border border-outline-variant border-l-4 border-l-status-warning hover:border-outline",
  "in-progress":
    "bg-surface-container-lowest border border-outline-variant border-l-4 border-l-status-info shadow-sm",
  done: "bg-surface-container-low border border-outline-variant/30 border-l-4 border-l-status-success",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteTask, { isLoading: isDeleting, error: deleteError }] = useDeleteTaskMutation();
  useErrorToast(isApiError(deleteError) ? deleteError : null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: { task },
  });

  const dueDateDisplay = task.dueDate
    ? `Due ${new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    : new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={cn(
          "px-md py-sm group relative cursor-grab rounded-lg transition-all",
          cardBase[task.status],
          isDragging && "opacity-50",
        )}
        {...attributes}
        {...listeners}
      >
        {/* Title row */}
        <div className="mb-xs gap-xs flex items-center">
          {task.status === "done" && (
            <Icon icon={CheckCircle2} size={20} className="text-status-success shrink-0" />
          )}
          <h3
            className={cn(
              "text-h3 line-clamp-1 font-semibold leading-snug",
              task.status === "done" ? "text-on-surface-variant line-through" : "text-primary",
            )}
          >
            {task.title}
          </h3>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mb-sm text-body-sm text-on-surface-variant line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div
          className={cn(
            "mt-md flex items-center justify-between border-t pt-1",
            !task.description && "mt-sm",
          )}
        >
          <div className="gap-xs text-on-surface-variant flex items-center">
            <Icon icon={Calendar} size={12} />
            <span className="font-mono text-xs uppercase">{dueDateDisplay}</span>
          </div>
          <div className="gap-xs flex items-center">
            <IconButton
              icon={Pencil}
              label="Edit task"
              size={14}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                setEditOpen(true);
              }}
            />
            <IconButton
              icon={Trash2}
              label="Delete task"
              size={14}
              className="hover:text-error"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      <TaskCreationModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
        }}
        task={task}
      />

      <DeleteConfirmationModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
        }}
        onConfirm={() => {
          void deleteTask(task._id);
          setDeleteOpen(false);
        }}
        isLoading={isDeleting}
        taskTitle={task.title}
      />
    </>
  );
}
