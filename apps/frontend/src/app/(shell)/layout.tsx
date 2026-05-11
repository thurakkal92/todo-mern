import { NavShell } from "@/components/organisms/NavShell";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen">
      <NavShell>{children}</NavShell>
    </div>
  );
}
