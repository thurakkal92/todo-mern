"use client";

import Link from "next/link";
import { Menu, Plus, Bell, Settings } from "lucide-react";
import { Icon } from "@/components/atoms/Icon";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "../atoms/Button";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="gap-md bg-surface px-md fixed left-0 right-0 top-0 z-20 flex h-16 items-center">
      {/* Hamburger — mobile only */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="p-sm text-on-surface-variant hover:text-primary mr-xs flex-shrink-0 rounded-lg transition-colors lg:hidden"
        >
          <Icon icon={Menu} size={22} />
        </button>
      )}

      <div className="gap-sm ml-auto flex items-center">
        {/* Create New */}
        <Link href="/tasks/new">
          <Button variant="secondary" size="sm">
            <Icon icon={Plus} size={16} />
            Create new task
          </Button>
        </Link>

        {/* Notification */}
        <button
          aria-label="Notifications"
          className="p-sm text-on-surface-variant hover:text-primary rounded-lg transition-colors"
        >
          <Icon icon={Bell} size={20} />
        </button>

        {/* Settings */}
        <button
          aria-label="Settings"
          className="p-sm text-on-surface-variant hover:text-primary rounded-lg transition-colors"
        >
          <Icon icon={Settings} size={20} />
        </button>

        {/* User avatar */}
        <Avatar name="Team Member" color="success" size="md" />
      </div>
    </header>
  );
}
