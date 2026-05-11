import Link from "next/link";
import { cn } from "@/lib/cn";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("gap-xs flex items-center", className)}>
      {items.map((item, i) => (
        <span key={i} className="gap-xs flex items-center">
          {i > 0 && (
            <span className="text-body-sm text-outline-variant" aria-hidden="true">
              /
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-body-sm text-on-surface" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
