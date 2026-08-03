"use client";

import { cn } from "@/lib/cn";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      {/* Main content – scrollable above bottom nav */}
      <main
        className={cn(
          "flex-1 flex flex-col overflow-y-auto",
          "pb-20", // space for bottom nav
          className
        )}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}





