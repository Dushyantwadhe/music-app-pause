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
        "rounded border border-[#E8E1D4] bg-[#FDFBF6] p-3",
        glow && "shadow-sm",
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
    <div className={cn("mb-3 flex items-center justify-between", className)}>
      <div>
        <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
        {subtitle && <p className="text-xs text-[#6b7280]">{subtitle}</p>}
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
        "rounded border px-3 py-1.5 text-xs font-medium",
        active
          ? "border-[#c89c5d] bg-[#f3ebdd] text-[#8a5a2b]"
          : "border-[#e8e1d4] bg-[#fdfbf6] text-[#374151] hover:bg-[#f7f0e2]"
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
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        variant === "primary" && "bg-[#f3ebdd] text-[#8a5a2b]",
        variant === "success" && "bg-[#ecfdf5] text-[#047857]",
        variant === "danger" && "bg-[#fef2f2] text-[#b91c1c]",
        variant === "muted" && "bg-[#f3f4f6] text-[#4b5563]"
      )}
    >
      {children}
    </span>
  );
}
