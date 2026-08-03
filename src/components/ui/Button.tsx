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
          "inline-flex items-center justify-center font-medium rounded-xl",
          "transition-all duration-150 active:scale-95 focus-visible:outline",
          "focus-visible:outline-2 focus-visible:outline-[#F59E0B] focus-visible:outline-offset-2",
          "disabled:opacity-40 disabled:pointer-events-none",
          variant === "primary" &&
            "bg-[#F59E0B] text-[#0F172A] hover:bg-[#FBBF24] shadow-lg shadow-amber-900/30",
          variant === "ghost" &&
            "bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]",
          variant === "danger" &&
            "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20",
          variant === "surface" &&
            "bg-[#1E293B] text-[#F8FAFC] hover:bg-[#273548] border border-[#334155]",
          variant === "outline" &&
            "bg-transparent border border-[#334155] text-[#94A3B8] hover:border-[#F59E0B] hover:text-[#F59E0B]",
          size === "sm"   && "h-8  px-3  text-xs  gap-1.5",
          size === "md"   && "h-10 px-4  text-sm  gap-2",
          size === "lg"   && "h-12 px-6  text-base gap-2.5",
          size === "icon" && "h-10 w-10  text-sm",
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

