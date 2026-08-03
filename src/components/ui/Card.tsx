import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#1E293B] border border-[#334155] p-4",
        glow && "glow-primary",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div>
        <h2 className="text-base font-semibold text-[#F8FAFC]">{title}</h2>
        {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

interface TabChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function TabChip({ label, active, onClick }: TabChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
        active
          ? "bg-[#F59E0B] text-[#0F172A]"
          : "bg-[#273548] text-[#64748B] hover:text-[#94A3B8]"
      )}
    >
      {label}
    </button>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "muted" | "danger";
}

export function Badge({ children, variant = "muted" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variant === "primary" && "bg-[#F59E0B]/15 text-[#F59E0B]",
        variant === "success" && "bg-[#22C55E]/15 text-[#22C55E]",
        variant === "danger"  && "bg-[#EF4444]/15 text-[#EF4444]",
        variant === "muted"   && "bg-[#273548] text-[#64748B]"
      )}
    >
      {children}
    </span>
  );
}
