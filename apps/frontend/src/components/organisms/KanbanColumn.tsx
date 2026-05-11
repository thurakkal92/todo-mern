"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import type { Task, TaskStatus } from "@todo/shared";
import { ColumnHeader } from "@/components/molecules/ColumnHeader";
import { AddCardButton } from "@/components/molecules/AddCardButton";
import { TaskCardSkeleton } from "@/components/molecules/TaskCardSkeleton";
import { Icon } from "@/components/atoms/Icon";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/cn";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  isLoading?: boolean;
}

export function KanbanColumn({ status, tasks, isLoading = false }: KanbanColumnProps) {
  const router = useRouter();
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  const taskIds = sorted.map((t) => t._id);

  return (
    <div className="gap-sm flex min-w-[320px] max-w-sm flex-1 flex-col">
      <ColumnHeader status={status} count={tasks.length} />

      <div
        ref={setNodeRef}
        className={cn(
          "gap-sm p-xs flex min-h-[200px] flex-1 flex-col rounded-lg transition-colors",
          isOver && "bg-status-info/5",
        )}
      >
        {isLoading ? (
          <>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </>
        ) : sorted.length === 0 ? (
          <div className="border-outline-variant py-xl flex flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
            <Icon name="add_circle" size={24} className="mb-sm text-outline" />
            <p className="text-body-sm text-on-surface-variant/60">
              No tasks yet. Drop one here or add a card.
            </p>
          </div>
        ) : (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {sorted.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </SortableContext>
        )}
      </div>

      <AddCardButton
        onClick={() => {
          router.push("/tasks/new");
        }}
      />
    </div>
  );
}
