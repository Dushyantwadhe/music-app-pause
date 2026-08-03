"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  {
    href: "/harmonium",
    label: "Harmonium",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <rect x="2" y="8" width="20" height="10" rx="2" />
        <path d="M5 8V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
        <path d="M10 8V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
        <path d="M15 8V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
        <line x1="5" y1="11" x2="5" y2="15" strokeWidth={2.5} strokeLinecap="round" />
        <line x1="8" y1="11" x2="8" y2="14" strokeLinecap="round" />
        <line x1="11" y1="11" x2="11" y2="15" strokeWidth={2.5} strokeLinecap="round" />
        <line x1="14" y1="11" x2="14" y2="13" strokeLinecap="round" />
        <line x1="17" y1="11" x2="17" y2="15" strokeWidth={2.5} strokeLinecap="round" />
        <line x1="20" y1="11" x2="20" y2="14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/tabla",
    label: "Tabla",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <ellipse cx="8" cy="16" rx="5" ry="7" />
        <ellipse cx="16" cy="16" rx="5" ry="7" />
        <ellipse cx="8" cy="16" rx="3" ry="4.5" fill={active ? "currentColor" : "none"} opacity={0.3} />
        <ellipse cx="16" cy="16" rx="3" ry="4.5" fill={active ? "currentColor" : "none"} opacity={0.3} />
      </svg>
    ),
  },
  {
    href: "/library",
    label: "Library",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <path d="M4 19V5a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v13" />
        <path d="M4 19a2 2 0 0 0 2 2h13" />
        <circle cx="12" cy="11" r="3" fill={active ? "currentColor" : "none"} opacity={0.35} />
        <path d="M12 8v1M12 14v1M9 11h1M15 11h-1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <circle cx="12" cy="8" r="4" fill={active ? "currentColor" : "none"} opacity={0.3} />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center
                 bg-[#1E293B]/95 backdrop-blur-md border-t border-[#334155]"
      aria-label="Main navigation"
    >
      <div className="flex w-full max-w-lg mx-auto">
        {TABS.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2",
                "transition-colors duration-150",
                active
                  ? "text-[#F59E0B]"
                  : "text-[#64748B] hover:text-[#94A3B8]"
              )}
            >
              {icon(active)}
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wide",
                  active ? "text-[#F59E0B]" : "text-[#64748B]"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
