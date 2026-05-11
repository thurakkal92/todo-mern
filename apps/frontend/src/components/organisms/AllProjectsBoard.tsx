"use client";

import { useGetProjectsQuery } from "@/store/workspaceApi";
import { KanbanBoard } from "./KanbanBoard";

export function AllProjectsBoard() {
  const { data: projects, isLoading } = useGetProjectsQuery(undefined);

  if (isLoading || projects === undefined) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      {projects.map((project) => (
        <section key={project._id} className="border-outline-variant/30 border-t">
          <div className="px-md pt-md pb-xs sm:px-lg sm:pt-lg">
            <h2 className="text-h3 sm:text-h2 text-on-primary-fixed font-semibold">
              {project.name}
            </h2>
          </div>
          <KanbanBoard projectId={project._id} stacked />
        </section>
      ))}
      <section className="border-outline-variant/30 border-t">
        <div className="px-md pt-md pb-xs sm:px-lg sm:pt-lg">
          <h2 className="text-h3 sm:text-h2 text-on-primary-fixed font-semibold">No Project</h2>
        </div>
        <KanbanBoard projectId="none" stacked />
      </section>
    </div>
  );
}
