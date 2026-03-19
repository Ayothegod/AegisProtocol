import { cn } from "@/lib/utils";

type ValueColor = "accent" | "danger" | "warn" | "plain";
type DeltaType = "positive" | "negative" | "neutral";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: DeltaType;
  valueColor: ValueColor;
}

const valueColorMap: Record<ValueColor, string> = {
  accent: "text-accent",
  danger: "text-danger",
  warn: "text-warn",
  plain: "text-text",
};

const deltaColorMap: Record<DeltaType, string> = {
  positive: "text-accent",
  negative: "text-danger",
  neutral: "text-text-3",
};

export function StatCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  valueColor,
}: StatCardProps) {
  return (
    <div
      className="
      relative overflow-hidden
      p-4 bg-surface
      border border-border rounded-md
      hover:border-border-hi transition-colors
    "
    >
      {/* top shimmer line */}
      <div
        className="
        absolute top-0 left-0 right-0 h-px
        bg-linear-to-r from-transparent via-accent/20 to-transparent
      "
      />

      <p className="text-[11px] font-medium tracking-widest uppercase text-text-3 mb-2.5">
        {label}
      </p>

      <p
        className={cn(
          "font-mono text-[30px] leading-none tracking-tight",
          valueColorMap[valueColor],
        )}
      >
        {value}
      </p>

      {delta && (
        <p
          className={cn(
            "font-mono text-[11px] mt-2 flex items-center gap-1 text-text-3",
          )}
        >
          <span className={deltaColorMap[deltaType]}>
            {deltaType === "positive"
              ? "↑"
              : deltaType === "negative"
                ? "↑"
                : "·"}
          </span>
          {delta}
        </p>
      )}
    </div>
  );
}
