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
    <header className="border-b border-[#d1d5db] bg-white" aria-label="Main navigation">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-2 md:px-4">
        <Link href="/" className="text-base font-semibold text-[#111827]">
          Riyaaz
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
                active ? "border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8]" : "border-transparent text-[#374151] hover:bg-[#f3f4f6]"
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
