"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  PointerSensor,
  type CollisionDetection,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Task, TaskStatus } from "@todo/shared";
import { useGetTasksQuery, useMoveTaskMutation } from "@/store/tasksApi";
import { useAppSelector } from "@/store/hooks";
import { useErrorToast } from "@/hooks/useErrorToast";
import { isApiError } from "@/lib/apiError";
import { ToastCard } from "@/components/atoms/ToastCard";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCreationModal } from "./TaskCreationModal";
import { Icon } from "@/components/atoms/Icon";
import { Button } from "@/components/atoms/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/atoms/Tabs";
import { cn } from "@/lib/cn";

const STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];

const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

const TAB_LABEL: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

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

interface KanbanBoardProps {
  projectId?: string;
  stacked?: boolean;
}

export function KanbanBoard({ projectId: projectIdProp, stacked = false }: KanbanBoardProps) {
  const reduxProjectId = useAppSelector((state) => state.workspace.activeProjectId);
  const activeProjectId = projectIdProp !== undefined ? projectIdProp : reduxProjectId;
  const queryArg = activeProjectId ?? undefined;

  const { data: tasks, isLoading, isError, refetch } = useGetTasksQuery(queryArg);
  const [moveTask, { error: moveError }] = useMoveTaskMutation();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [mobileTab, setMobileTab] = useState<TaskStatus>("todo");
  const [modalState, setModalState] = useState<{ isOpen: boolean; defaultStatus: TaskStatus }>({
    isOpen: false,
    defaultStatus: "todo",
  });

  useErrorToast(isApiError(moveError) ? moveError : null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragStart({ active }: DragStartEvent) {
    const task = (tasks ?? []).find((t) => t._id === active.id);
    setActiveTask(task ?? null);
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
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

    const isCrossColumnMove = targetStatus !== draggedTask.status;

    try {
      await moveTask({
        id: draggedId,
        body: { status: targetStatus, order: newOrder },
        ...(queryArg !== undefined ? { projectId: queryArg } : {}),
      }).unwrap();

      if (isCrossColumnMove) {
        toast.custom(() => (
          <ToastCard
            variant="success"
            title="Task moved"
            description={`"${draggedTask.title}" → ${TAB_LABEL[targetStatus]}`}
          />
        ));
      }
    } catch {
      // error state is handled by useErrorToast via moveError
    }
  }

  if (isError) {
    return (
      <div className="gap-md px-2xl py-xl flex flex-1 flex-col items-center justify-center">
        <Icon icon={AlertCircle} size={40} className="text-error" />
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
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={(e) => {
        void handleDragEnd(e);
      }}
    >
      {/* Mobile: segmented tab switcher — one column at a time */}
      <div className={cn("flex flex-col sm:hidden", !stacked && "flex-1")}>
        <Tabs
          value={mobileTab}
          onValueChange={(v) => {
            setMobileTab(v as TaskStatus);
          }}
          className="px-md pt-md pb-sm"
        >
          <TabsList>
            {STATUSES.map((status) => (
              <TabsTrigger key={status} value={status}>
                {TAB_LABEL[status]}
              </TabsTrigger>
            ))}
          </TabsList>

          {STATUSES.map((status) => (
            <TabsContent key={status} value={status} className="pt-sm">
              <KanbanColumn
                status={status}
                tasks={tasksByStatus[status]}
                isLoading={isLoading}
                onAddCard={() => {
                  setModalState({ isOpen: true, defaultStatus: status });
                }}
                hideHeader
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Desktop: horizontal three-column layout */}
      <div
        className={cn(
          "gap-sm sm:gap-lg px-sm pt-sm pb-md sm:px-md sm:pt-md sm:pb-md hidden overflow-x-auto sm:flex",
          !stacked && "flex-1",
        )}
      >
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            isLoading={isLoading}
            onAddCard={() => {
              setModalState({ isOpen: true, defaultStatus: status });
            }}
          />
        ))}
      </div>

      <TaskCreationModal
        isOpen={modalState.isOpen}
        onClose={() => {
          setModalState((prev) => ({ ...prev, isOpen: false }));
        }}
        defaultStatus={modalState.defaultStatus}
        {...(projectIdProp !== undefined && projectIdProp !== "none"
          ? { defaultProjectId: projectIdProp }
          : {})}
      />

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
