"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  iconFilled?: string;
}

const navItems: NavItem[] = [
  { label: "Tasks", href: "/board", icon: "assignment", iconFilled: "assignment" },
  { label: "Create Task", href: "/tasks/new", icon: "add_circle" },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "gap-sm px-md py-sm text-body-sm flex items-center rounded-xl transition-all",
        active
          ? "bg-on-primary-fixed-variant/20 font-semibold text-white"
          : "text-on-primary-container/70 hover:bg-on-primary-fixed-variant/10 hover:text-white",
      )}
    >
      <Icon
        name={active && item.iconFilled ? item.iconFilled : item.icon}
        filled={active && !!item.iconFilled}
        size={20}
      />
      {item.label}
    </Link>
  );
}

interface SideNavProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function SideNav({ mobileOpen = false, onClose, className }: SideNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={cn(
        "bg-primary-container fixed inset-y-0 left-0 z-30 flex w-64 flex-col transition-transform duration-300",
        // Mobile: slide in/out. Desktop: always visible.
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className,
      )}
    >
      {/* Brand */}
      <div className="gap-sm p-lg flex items-center">
        <span className="bg-secondary flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl">
          <Icon name="dashboard" size={20} className="text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-body-sm truncate font-bold text-white">Core Workspace</p>
          <p className="text-on-primary-container/70 truncate text-[11px]">Enterprise Suite</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="text-on-primary-container/70 transition-colors hover:text-white lg:hidden"
          >
            <Icon name="close" size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="px-sm py-xs flex-1 overflow-y-auto">
        <div className="gap-xs flex flex-col">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-on-primary-fixed-variant/20 p-sm border-t">
        <button
          onClick={() => {
            router.push("/tasks/new");
          }}
          className="gap-sm bg-secondary px-md py-sm text-body-sm flex w-full items-center rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Icon name="add" size={18} className="text-white" />
          New Task
        </button>
      </div>
    </aside>
  );
}
