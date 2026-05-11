"use client";

import { useAppSelector } from "@/store/hooks";
import { KanbanBoard } from "./KanbanBoard";
import { AllProjectsBoard } from "./AllProjectsBoard";

export function BoardContent() {
  const activeProjectId = useAppSelector((state) => state.workspace.activeProjectId);

  return activeProjectId !== null ? <KanbanBoard /> : <AllProjectsBoard />;
}
