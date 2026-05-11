"use client";

import { X } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { Button } from "@/components/atoms/Button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  taskTitle: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  taskTitle,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="p-md fixed inset-0 z-50 flex items-center justify-center"
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-surface-container-lowest p-xl relative z-10 w-full max-w-lg rounded-xl shadow-xl">
        <div className="mb-lg flex items-center justify-between">
          <h2 className="text-h2 text-primary font-semibold">Delete confirmation</h2>
          <IconButton icon={X} label="Close modal" onClick={onClose} />
        </div>

        <div className="mb-md gap-sm flex flex-col">
          <p className="text-body-sm text-on-surface-variant">
            <span className="text-on-surface font-semibold">&ldquo;{taskTitle}&rdquo;</span> will be
            permanently removed. This action cannot be undone.
          </p>
        </div>

        <div className="gap-sm flex w-[80%] justify-self-end">
          <Button
            variant="secondary"
            className="w-full"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="w-full"
            size="md"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
