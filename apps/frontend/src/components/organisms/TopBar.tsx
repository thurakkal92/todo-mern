"use client";

import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { Avatar } from "@/components/atoms/Avatar";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="gap-md border-outline-variant bg-surface px-md fixed left-0 right-0 top-0 z-20 flex h-16 items-center border-b lg:left-64">
      {/* Hamburger — mobile only */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="p-sm text-on-surface-variant hover:text-primary mr-xs flex-shrink-0 rounded-lg transition-colors lg:hidden"
        >
          <Icon name="menu" size={22} />
        </button>
      )}

      {/* Search */}
      <div className="gap-sm bg-surface-container-low px-sm flex max-w-xs flex-1 items-center rounded-lg py-1.5">
        <Icon name="search" size={18} className="text-outline flex-shrink-0" />
        <input
          type="search"
          placeholder="Search tasks…"
          className="text-body-sm text-on-surface placeholder:text-outline-variant flex-1 bg-transparent outline-none"
        />
      </div>

      <div className="gap-sm ml-auto flex items-center">
        {/* Create New */}
        <Link
          href="/tasks/new"
          className="gap-xs bg-primary px-md text-body-sm text-on-primary inline-flex items-center rounded-lg py-1.5 font-semibold transition-opacity hover:opacity-90"
        >
          <Icon name="add" size={16} className="text-on-primary" />
          Create New
        </Link>

        {/* Notification */}
        <button
          aria-label="Notifications"
          className="p-sm text-on-surface-variant hover:text-primary rounded-lg transition-colors"
        >
          <Icon name="notifications" size={20} />
        </button>

        {/* Settings */}
        <button
          aria-label="Settings"
          className="p-sm text-on-surface-variant hover:text-primary rounded-lg transition-colors"
        >
          <Icon name="settings" size={20} />
        </button>

        {/* User avatar */}
        <Avatar name="Team Member" size="md" />
      </div>
    </header>
  );
}
