"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { Task, TaskStatus } from "@todo/shared";
import { useGetTasksQuery, useMoveTaskMutation } from "@/store/tasksApi";
import { useErrorToast } from "@/hooks/useErrorToast";
import { isApiError } from "@/lib/apiError";
import { KanbanColumn } from "./KanbanColumn";
import { Icon } from "@/components/atoms/Icon";
import { Button } from "@/components/atoms/Button";

const STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];

function computeOrder(colTasks: Task[], overId: string): number {
  const overIdx = colTasks.findIndex((t) => t._id === overId);
  if (overIdx === -1) {
    const last = colTasks[colTasks.length - 1];
    return last !== undefined ? last.order + 1 : 0;
  }
  const prev = colTasks[overIdx - 1] ?? null;
  const next = colTasks[overIdx] ?? null;
  if (prev !== null && next !== null) return (prev.order + next.order) / 2;
  if (prev !== null) return prev.order + 1;
  if (next !== null) return next.order - 1;
  return 0;
}

export function KanbanBoard() {
  const { data: tasks, isLoading, isError, refetch } = useGetTasksQuery(undefined);
  const [moveTask, { error: moveError }] = useMoveTaskMutation();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useErrorToast(isApiError(moveError) ? moveError : null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragStart({ active }: DragStartEvent) {
    const task = (tasks ?? []).find((t) => t._id === active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    if (!over || !tasks) return;

    const draggedId = active.id as string;
    const overId = over.id as string;
    if (draggedId === overId) return;

    const draggedTask = tasks.find((t) => t._id === draggedId);
    if (!draggedTask) return;

    const targetStatus: TaskStatus = (STATUSES as string[]).includes(overId)
      ? (overId as TaskStatus)
      : (tasks.find((t) => t._id === overId)?.status ?? draggedTask.status);

    const colTasks = tasks
      .filter((t) => t.status === targetStatus && t._id !== draggedId)
      .sort((a, b) => a.order - b.order);

    let newOrder: number;
    if ((STATUSES as string[]).includes(overId)) {
      const last = colTasks[colTasks.length - 1];
      newOrder = last !== undefined ? last.order + 1 : 0;
    } else {
      newOrder = computeOrder(colTasks, overId);
    }

    void moveTask({ id: draggedId, body: { status: targetStatus, order: newOrder } });
  }

  if (isError) {
    return (
      <div className="gap-md px-2xl py-xl flex flex-1 flex-col items-center justify-center">
        <Icon name="error_outline" size={40} className="text-error" />
        <p className="text-body-md text-error">Failed to load tasks.</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            void refetch();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  const tasksByStatus = STATUSES.reduce<Record<TaskStatus, Task[]>>(
    (acc, s) => {
      acc[s] = (tasks ?? []).filter((t) => t.status === s);
      return acc;
    },
    { todo: [], "in-progress": [], done: [] },
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="gap-lg px-2xl pb-2xl pt-lg flex flex-1 overflow-x-auto">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            isLoading={isLoading}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="border-outline-variant bg-surface-container-lowest p-lg cursor-grabbing rounded-lg border shadow-lg">
            <p className="text-body-sm text-primary font-semibold">{activeTask.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
