"use client";

// Music App Button – fully replaced
import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "surface" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded border font-medium",
          "transition-colors focus-visible:outline-none",
          "disabled:opacity-40 disabled:pointer-events-none",
          variant === "primary" &&
            "border-[#2563eb] bg-[#2563eb] text-white hover:bg-[#1d4ed8]",
          variant === "ghost" &&
            "border-transparent bg-transparent text-[#374151] hover:bg-[#f3f4f6]",
          variant === "danger" &&
            "border-[#dc2626] bg-[#dc2626] text-white hover:bg-[#b91c1c]",
          variant === "surface" &&
            "border-[#d1d5db] bg-white text-[#111827] hover:bg-[#f9fafb]",
          variant === "outline" &&
            "border-[#d1d5db] bg-white text-[#111827] hover:bg-[#f9fafb]",
          size === "sm" && "h-8 px-3 text-xs gap-1",
          size === "md" && "h-9 px-4 text-sm gap-1.5",
          size === "lg" && "h-10 px-5 text-base gap-2",
          size === "icon" && "h-9 w-9 text-sm",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

