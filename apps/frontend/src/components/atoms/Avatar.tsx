import { cn } from "@/lib/cn";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md";
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export function Avatar({ name, src, size = "sm", className }: AvatarProps) {
  const sizeClass = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";

  return (
    <span
      className={cn(
        "border-outline-variant bg-surface-container-high text-on-surface-variant inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full border font-semibold",
        sizeClass,
        className,
      )}
      title={name}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials(name)}
    </span>
  );
}
