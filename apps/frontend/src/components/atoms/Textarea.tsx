"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="gap-xs flex flex-col">
        <textarea
          ref={ref}
          rows={6}
          className={cn(
            "bg-surface-bright p-md text-body-md placeholder:text-outline-variant w-full resize-none rounded-lg border transition-all focus:outline-none",
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
Textarea.displayName = "Textarea";
