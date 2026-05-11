"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, PlusCircle } from "lucide-react";
import type { Task, TaskStatus } from "@todo/shared";
import { ColumnHeader } from "@/components/molecules/ColumnHeader";
import { TaskCardSkeleton } from "@/components/molecules/TaskCardSkeleton";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/cn";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  isLoading?: boolean;
  onAddCard: () => void;
  hideHeader?: boolean;
}

export function KanbanColumn({
  status,
  tasks,
  isLoading = false,
  onAddCard,
  hideHeader = false,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  const taskIds = sorted.map((t) => t._id);

  return (
    <div
      className={cn(
        "gap-sm flex flex-1 flex-col",
        !hideHeader && "min-w-[260px] sm:min-w-[300px] lg:min-w-[320px]",
      )}
    >
      {!hideHeader && <ColumnHeader status={status} count={tasks.length} />}

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
        ) : (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {sorted.length === 0 ? (
              <div className="border-outline-variant py-xl flex flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                <Icon icon={PlusCircle} size={24} className="mb-sm text-outline" />
                <p className="text-body-sm text-on-surface-variant/60">
                  No tasks yet. Drop one here or add a card.
                </p>
              </div>
            ) : (
              sorted.map((task) => <TaskCard key={task._id} task={task} />)
            )}
          </SortableContext>
        )}

        <Button variant="dotted" size="sm" onClick={onAddCard} className="mt-xs w-full">
          <Icon icon={Plus} size={16} />
          Add Task
        </Button>
      </div>
    </div>
  );
}
