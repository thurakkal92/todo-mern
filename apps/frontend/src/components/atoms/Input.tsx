"use client";

import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  inputSize?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, inputSize = "md", className, ...props }, ref) => {
    const sizeClass =
      inputSize === "lg"
        ? "h-11 px-3 py-2 text-body-md"
        : inputSize === "sm"
          ? "h-9 px-3 text-body-sm"
          : "h-10 px-3 py-2 text-body-sm";

    return (
      <div className="gap-xs flex flex-col">
        <input
          ref={ref}
          className={cn(
            "bg-surface-bright placeholder:text-outline-variant w-full rounded-lg border transition-all focus:outline-none",
            sizeClass,
            error
              ? "border-error ring-error/10 ring-4"
              : "border-outline-variant focus:border-secondary focus:ring-secondary/10 focus:ring-4",
            className,
          )}
          {...props}
        />
        {error && (
          <span className="mt-xs gap-xs text-body-sm text-error flex items-center">
            <AlertCircle size={16} aria-hidden="true" />
            {error}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
