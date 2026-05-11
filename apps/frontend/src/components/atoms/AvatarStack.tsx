import { Avatar } from "./Avatar";
import { cn } from "@/lib/cn";

interface AvatarEntry {
  name: string;
  src?: string;
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
          {...(a.src !== undefined && { src: a.src })}
          className={i > 0 ? "-ml-2" : ""}
        />
      ))}
      {overflow > 0 && (
        <span className="border-outline-variant bg-surface-container text-on-surface-variant -ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold">
          +{overflow}
        </span>
      )}
    </span>
  );
}
