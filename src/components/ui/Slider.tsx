import { cn } from "@/lib/cn";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  className?: string;
  formatValue?: (v: number) => string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  className,
  formatValue,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs font-mono text-[#F59E0B]">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div className="absolute inset-y-0 my-auto h-1.5 w-full rounded-full bg-[#273548]" />
        {/* Fill */}
        <div
          className="absolute inset-y-0 my-auto h-1.5 rounded-full bg-[#F59E0B]"
          style={{ width: `${pct}%` }}
        />
        {/* Native input for accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 w-full opacity-0 h-5 cursor-pointer"
          aria-label={label}
        />
      </div>
    </div>
  );
}
