import { cn } from "@/lib/cn";

interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
  size?: number;
}

export function Icon({ name, filled = false, className, size = 24 }: IconProps) {
  return (
    <span
      className={cn(filled ? "material-symbols-filled" : "material-symbols-outlined", className)}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
