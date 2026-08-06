"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  {
    href: "/",
    label: "Sessions",
  },
  {
    href: "/harmonium",
    label: "Harmonium",
  },
  {
    href: "/tabla",
    label: "Tabla",
  },
  {
    href: "/profile",
    label: "Profile",
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#e8e1d4] bg-[#fdfbf6]" aria-label="Main navigation">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-2 md:px-4">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold text-[#111827]" aria-label="Riyaaz home">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#c89c5d] bg-[#f3ebdd] text-[#8a5a2b]">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5">
              <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="8" y1="6" x2="8" y2="18" stroke="currentColor" strokeWidth="1.2" />
              <line x1="14" y1="6" x2="14" y2="18" stroke="currentColor" strokeWidth="1.2" />
              <rect x="6.6" y="6" width="2.2" height="7" rx="0.5" fill="currentColor" />
              <rect x="12.6" y="6" width="2.2" height="7" rx="0.5" fill="currentColor" />
            </svg>
          </span>
          <span>Riyaaz</span>
        </Link>
        <nav className="flex items-center gap-2">
          {TABS.map(({ href, label }) => {
          const active =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/session")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded border px-2.5 py-1 text-xs",
                active ? "border-[#c89c5d] bg-[#f3ebdd] text-[#8a5a2b]" : "border-transparent text-[#374151] hover:bg-[#f7f0e2]"
              )}
            >
              {label}
            </Link>
          );
        })}
        </nav>
      </div>
    </header>
  );
}
