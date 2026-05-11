"use client";

import { X } from "lucide-react";
import type { Task, TaskStatus } from "@todo/shared";
import { IconButton } from "@/components/atoms/IconButton";
import { TaskCreationForm } from "./TaskCreationForm";

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
  task?: Task;
  defaultProjectId?: string;
}

export function TaskCreationModal({
  isOpen,
  onClose,
  defaultStatus,
  task,
  defaultProjectId,
}: TaskCreationModalProps) {
  if (!isOpen) return null;

  const isEditMode = task !== undefined;

  return (
    <div
      className="p-md fixed inset-0 z-50 flex items-center justify-center"
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-surface-container-lowest p-xl relative z-10 w-full max-w-xl rounded-xl shadow-xl">
        <div className="mb-lg flex items-center justify-between">
          <h2 className="text-h2 text-primary font-semibold">
            {isEditMode ? "Edit Task" : "Add New Task"}
          </h2>
          <IconButton icon={X} label="Close modal" onClick={onClose} />
        </div>
        <TaskCreationForm
          {...(defaultStatus !== undefined ? { defaultStatus } : {})}
          {...(task !== undefined ? { task } : {})}
          {...(defaultProjectId !== undefined ? { defaultProjectId } : {})}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
