"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  LayoutGrid,
  ClipboardList,
  Bell,
  BarChart2,
  ChevronsUpDown,
  X,
  Star,
  Settings,
  HelpCircle,
  MessageSquare,
  Keyboard,
} from "lucide-react";
import { Icon } from "@/components/atoms/Icon";
import { TeamSpacesSection } from "@/components/organisms/TeamSpacesSection";
import { clearActiveProject } from "@/store/workspaceSlice";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/cn";
import { IconButton } from "../atoms/IconButton";

// ─── Primary nav items ────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  clearProject?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutGrid },
  { label: "Tasks", href: "/board", icon: ClipboardList, clearProject: true },
  { label: "Inbox", href: "/inbox", icon: Bell, badge: "3" },
  { label: "Feedback", href: "/feedback", icon: BarChart2 },
];

const footerItems: { icon: LucideIcon; label: string }[] = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
  { icon: MessageSquare, label: "Feedback" },
  { icon: Keyboard, label: "Shortcuts" },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const dispatch = useAppDispatch();

  function handleClick() {
    if (item.clearProject) dispatch(clearActiveProject());
  }

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={cn(
        "gap-sm px-md py-sm text-body-sm flex items-center rounded-lg transition-colors",
        active
          ? "bg-surface-container text-on-primary-fixed font-semibold"
          : "text-on-primary-fixed hover:bg-surface-container hover:text-on-surface",
      )}
    >
      <Icon icon={item.icon} size={18} className="flex-shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="bg-status-info text-on-secondary text-caption rounded-full px-1.5 py-0.5 font-semibold">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── SideNav ──────────────────────────────────────────────────────────────────

interface SideNavProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function SideNav({ mobileOpen = false, onClose, className }: SideNavProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "border-outline-variant fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-white transition-transform duration-300",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className,
      )}
    >
      {/* Workspace header */}
      <div className="border-outline-variant flex items-center gap-3 px-4 py-3">
        <span className="bg-primary-container flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl">
          <Icon icon={LayoutDashboard} size={20} className="text-status-success" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-body-sm text-on-surface truncate font-semibold">Acme Corp</p>
          <p className="text-caption text-on-surface-variant truncate">Enterprise Workspace</p>
        </div>
        <Icon icon={ChevronsUpDown} size={16} className="text-on-surface-variant flex-shrink-0" />
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="text-on-surface-variant hover:text-on-surface transition-colors lg:hidden"
          >
            <Icon icon={X} size={18} />
          </button>
        )}
      </div>

      {/* Scrollable nav body */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {/* Primary navigation */}
        <div className="gap-xs flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
            />
          ))}
        </div>

        <div className="border-outline-variant mx-2 my-3 border-t opacity-50" />

        {/* Team Spaces */}
        <TeamSpacesSection />

        <div className="border-outline-variant mx-2 my-3 border-t opacity-50" />

        {/* Favorites */}
        <div className="px-md pb-xs pt-sm">
          <span className="text-label-caps text-on-surface-variant/50 uppercase tracking-widest">
            Favorites
          </span>
        </div>
        <div className="gap-xs flex flex-col">
          <NavLink item={{ href: "#", label: "Roadmap 2024", icon: Star }} active={false} />
        </div>
      </nav>

      {/* Footer */}
      <div className="border-outline-variant border-t">
        {/* Icon grid */}
        <div className="border-outline-variant/30 grid grid-cols-4 border-b">
          {footerItems.map(({ icon, label }) => (
            <IconButton
              key={label}
              icon={icon}
              aria-label={label}
              label={label}
              // className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex items-center justify-center py-2 transition-colors"
            ></IconButton>
          ))}
        </div>
      </div>
    </aside>
  );
}
