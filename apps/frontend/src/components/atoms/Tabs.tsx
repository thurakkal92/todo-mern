"use client";

import { createContext, useContext } from "react";
import { cn } from "@/lib/cn";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs subcomponents must be rendered inside <Tabs>");
  return ctx;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "border-outline-variant bg-tertiary-fixed p-xs flex items-center rounded-xl border",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext();
  const isActive = value === activeValue;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => {
        onValueChange(value);
      }}
      className={cn(
        "py-sm text-body-sm flex-1 rounded-lg text-center transition-colors",
        isActive
          ? "text-primary-container bg-white font-semibold shadow-sm"
          : "text-primary-container hover:bg-surface-variant font-medium",
        className,
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: activeValue } = useTabsContext();
  if (value !== activeValue) return null;
  return (
    <div role="tabpanel" className={cn("flex-1", className)}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
