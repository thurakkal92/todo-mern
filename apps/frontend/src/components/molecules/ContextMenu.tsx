"use client";

import { useEffect, useRef } from "react";
import type { TaskStatus } from "@todo/shared";

const moveOptions: Record<TaskStatus, { label: string; target: TaskStatus }[]> = {
  todo: [
    { label: "Move to In Progress", target: "in-progress" },
    { label: "Move to Done", target: "done" },
  ],
  "in-progress": [
    { label: "Move to To Do", target: "todo" },
    { label: "Move to Done", target: "done" },
  ],
  done: [
    { label: "Move to To Do", target: "todo" },
    { label: "Move to In Progress", target: "in-progress" },
  ],
};

interface ContextMenuProps {
  status: TaskStatus;
  onMove: (target: TaskStatus) => void;
  onClose: () => void;
}

export function ContextMenu({ status, onMove, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="border-outline-variant bg-surface-container-lowest absolute right-0 top-0 z-50 min-w-[180px] rounded-xl border shadow-md"
      role="menu"
    >
      {moveOptions[status].map(({ label, target }) => (
        <button
          key={target}
          role="menuitem"
          onClick={() => {
            onMove(target);
            onClose();
          }}
          className="px-md py-sm text-body-sm text-on-surface hover:bg-surface-container-low w-full text-left transition-colors first:rounded-t-xl last:rounded-b-xl"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
