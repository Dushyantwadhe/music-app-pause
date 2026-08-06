"use client";

import { cn } from "@/lib/cn";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#111827]">
      <BottomNav />
      <main className={cn("mx-auto w-full max-w-6xl px-3 py-2 md:px-4 md:py-3", className)}>
        {children}
      </main>
    </div>
  );
}





