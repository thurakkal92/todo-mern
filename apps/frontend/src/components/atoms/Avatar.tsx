import { cn } from "@/lib/cn";

export type AvatarColor = "default" | "info" | "success" | "warning";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md";
  color?: AvatarColor;
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

const colorClasses: Record<AvatarColor, string> = {
  default: "bg-surface-container-high text-on-surface-variant border-outline-variant",
  info: "bg-status-info    text-white border-transparent",
  success: "bg-status-success text-on-surface border-transparent",
  warning: "bg-status-warning text-on-surface border-transparent",
};

export function Avatar({ name, src, size = "sm", color = "default", className }: AvatarProps) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-[12px]" : "w-10 h-10 text-sm";

  return (
    <span
      className={cn(
        "inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-[100%] border font-semibold",
        sizeClass,
        colorClasses[color],
        className,
      )}
      title={name}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials(name)}
    </span>
  );
}
