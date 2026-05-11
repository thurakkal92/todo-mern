"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  inputSize?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, inputSize = "md", className, ...props }, ref) => {
    const sizeClass =
      inputSize === "lg"
        ? "text-h2 p-md"
        : inputSize === "sm"
          ? "text-body-sm px-sm py-1.5"
          : "text-body-md p-md";

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
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              error
            </span>
            {error}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
