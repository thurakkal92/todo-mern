"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error" | "info";

interface ToastCardProps {
  variant: ToastVariant;
  title: string;
  description?: string;
}

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; iconClass: string; borderClass: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-status-success",
    borderClass: "border-l-status-success",
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-error",
    borderClass: "border-l-error",
  },
  info: {
    icon: Info,
    iconClass: "text-status-info",
    borderClass: "border-l-status-info",
  },
};

export function ToastCard({ variant, title, description }: ToastCardProps) {
  const { icon, iconClass, borderClass } = variantConfig[variant];

  return (
    <div
      className={cn(
        "bg-surface-container-lowest border-outline-variant px-md py-sm rounded-lg border border-l-4 shadow-sm",
        borderClass,
      )}
    >
      <div className="gap-xs flex items-center">
        <Icon icon={icon} size={16} className={cn("shrink-0", iconClass)} />
        <p className="text-body-sm text-primary font-semibold">{title}</p>
      </div>
      {description && (
        <p className="text-body-sm text-on-surface-variant mt-xs pl-[20px]">{description}</p>
      )}
    </div>
  );
}
