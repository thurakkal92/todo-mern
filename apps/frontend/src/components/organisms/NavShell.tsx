"use client";

import { useState } from "react";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";

interface NavShellProps {
  children: React.ReactNode;
}

export function NavShell({ children }: NavShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => {
            setMobileNavOpen(false);
          }}
        />
      )}

      <SideNav
        mobileOpen={mobileNavOpen}
        onClose={() => {
          setMobileNavOpen(false);
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <TopBar
          onMenuClick={() => {
            setMobileNavOpen(true);
          }}
        />
        <main className="flex-1 pt-16">{children}</main>
      </div>
    </>
  );
}
