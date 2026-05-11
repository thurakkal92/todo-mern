"use client";

import { useAppSelector } from "@/store/hooks";
import { useGetProjectsQuery, useGetTeamsQuery } from "@/store/workspaceApi";
import type { Project, Team } from "@todo/shared";
import { ProjectHeader } from "./ProjectHeader";
import { AvatarStack } from "@/components/atoms/AvatarStack";
import type { AvatarColor } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { ListFilter } from "lucide-react";

const MOCK_MEMBERS: { name: string; color: AvatarColor }[] = [
  { name: "John Doe", color: "info" },
  { name: "Alice Kim", color: "success" },
  { name: "Sam Lee", color: "warning" },
  { name: "Maria N", color: "info" },
  { name: "Chris P", color: "success" },
  { name: "Dana Q", color: "warning" },
  { name: "Erik R", color: "info" },
  { name: "Fay S", color: "success" },
];

export function BoardViewHeader() {
  const activeProjectId = useAppSelector((state) => state.workspace.activeProjectId);
  const { data: projects = [] } = useGetProjectsQuery(undefined);
  const { data: teams = [] } = useGetTeamsQuery(undefined);

  const activeProject: Project | undefined = activeProjectId
    ? projects.find((p) => p._id === activeProjectId)
    : undefined;
  const activeTeam: Team | undefined = activeProject
    ? teams.find((t) => t._id === activeProject.teamId)
    : undefined;

  const title = activeProject ? activeProject.name : "All Projects";
  const teamName = activeTeam?.name;
  const subtitle = activeProject
    ? "Track and manage this project's tasks across all stages."
    : "Viewing tasks across all your projects.";

  const rightSlot = (
    <div className="gap-sm flex items-center">
      <AvatarStack avatars={MOCK_MEMBERS} max={3} />
      <div className="bg-outline-variant h-6 w-px" />
      <Button variant="ghost" size="sm">
        <Icon icon={ListFilter} size={16} />
        Filters
      </Button>
    </div>
  );

  return (
    <ProjectHeader
      title={title}
      {...(teamName !== undefined && { teamName })}
      subtitle={subtitle}
      rightSlot={rightSlot}
    />
  );
}
