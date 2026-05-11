import { cn } from "@/lib/cn";

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ children, className }: FormSectionProps) {
  return (
    <section
      className={cn(
        "border-outline-variant p-lg hover:border-secondary rounded-xl border bg-white transition-all duration-300 hover:shadow-[0_4px_20px_-2px_rgba(0,12,52,0.08)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
