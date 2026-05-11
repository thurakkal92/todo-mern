import { cn } from "@/lib/cn";

interface FormLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function FormLabel({ htmlFor, children, required, className }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider",
        className,
      )}
    >
      {children}
      {required && <span className="ml-xs text-error">*</span>}
    </label>
  );
}
