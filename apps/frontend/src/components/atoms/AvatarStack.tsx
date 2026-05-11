import { Avatar, type AvatarColor } from "./Avatar";
import { cn } from "@/lib/cn";

const CYCLE_COLORS: AvatarColor[] = ["info", "success", "warning"];

interface AvatarEntry {
  name: string;
  src?: string;
  color?: AvatarColor;
}

interface AvatarStackProps {
  avatars: AvatarEntry[];
  max?: number;
  className?: string;
}

export function AvatarStack({ avatars, max = 3, className }: AvatarStackProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <span className={cn("flex items-center", className)}>
      {visible.map((a, i) => (
        <Avatar
          key={i}
          name={a.name}
          color={a.color ?? CYCLE_COLORS[i % CYCLE_COLORS.length] ?? "default"}
          {...(a.src !== undefined && { src: a.src })}
          className={i > 0 ? "-ml-3" : ""}
        />
      ))}
      {overflow > 0 && (
        <span className="border-outline-variant bg-surface-container text-on-surface-variant -ml-3 inline-flex h-8 w-8 items-center justify-center rounded-[100%] border text-[12px] font-semibold">
          +{overflow}
        </span>
      )}
    </span>
  );
}
