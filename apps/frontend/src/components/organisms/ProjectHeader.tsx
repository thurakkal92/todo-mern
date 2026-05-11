import { StatusBadge } from "@/components/atoms/StatusBadge";

interface ProjectHeaderProps {
  title: string;
  teamName?: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export function ProjectHeader({ title, teamName, subtitle, rightSlot }: ProjectHeaderProps) {
  return (
    <div className="bg-surface-bright px-md pt-md pb-sm sm:px-lg sm:pt-lg sm:pb-md">
      <div className="gap-sm flex flex-wrap items-center justify-between">
        <div className="gap-sm flex flex-wrap items-center">
          <h1 className="text-h2 sm:text-h1 font-semibold tracking-tight">
            {teamName && (
              <>
                <span className="text-on-primary-fixed">{teamName}</span>
                <span className="text-on-surface-variant mx-2 font-normal">/</span>
              </>
            )}
            <span className="text-on-primary-fixed">{title}</span>
          </h1>
          <StatusBadge status="in-progress" />
        </div>
        {rightSlot}
      </div>
      {subtitle && <p className="mt-xs text-body-lg text-on-surface-variant">{subtitle}</p>}
    </div>
  );
}
