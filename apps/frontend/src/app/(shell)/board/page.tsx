import { ProjectHeader } from "@/components/organisms/ProjectHeader";
import { KanbanBoard } from "@/components/organisms/KanbanBoard";

export default function BoardPage() {
  return (
    <div className="bg-surface-bright flex h-full flex-col">
      <ProjectHeader
        title="My Team"
        subtitle="Track and manage your team's work across all stages."
      />
      <KanbanBoard />
    </div>
  );
}
