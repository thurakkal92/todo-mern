import { cn } from "@/lib/cn";

interface CheckCircleIconProps {
  className?: string;
  size?: number;
}

export function CheckCircleIcon({ className, size = 20 }: CheckCircleIconProps) {
  return (
    <span
      className={cn("material-symbols-filled text-status-success leading-none", className)}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      check_circle
    </span>
  );
}
