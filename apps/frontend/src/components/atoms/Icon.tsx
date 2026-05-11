import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface IconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
}

export function Icon({ icon: LucideIconComponent, className, size = 24 }: IconProps) {
  return <LucideIconComponent size={size} className={cn(className)} aria-hidden="true" />;
}
