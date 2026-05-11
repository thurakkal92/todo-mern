import { cn } from "@/lib/cn";

interface CategoryLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function CategoryLabel({ children, className }: CategoryLabelProps) {
  return (
    <span
      className={cn(
        "text-label-caps text-status-info font-semibold uppercase tracking-widest",
        className,
      )}
    >
      {children}
    </span>
  );
}
