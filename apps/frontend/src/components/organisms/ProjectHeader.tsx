import { StatusBadge } from "@/components/atoms/StatusBadge";

interface ProjectHeaderProps {
  title: string;
  subtitle?: string;
}

export function ProjectHeader({ title, subtitle }: ProjectHeaderProps) {
  return (
    <div className="bg-surface-bright px-2xl pb-xl pt-2xl">
      <div className="gap-sm flex flex-wrap items-center">
        <h1 className="text-h1 text-primary font-semibold tracking-tight">{title}</h1>
        <StatusBadge status="in-progress" />
      </div>
      {subtitle && <p className="mt-xs text-body-lg text-on-surface-variant">{subtitle}</p>}
    </div>
  );
}
