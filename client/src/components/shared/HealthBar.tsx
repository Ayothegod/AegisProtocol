import { cn } from "@/lib/utils";
import { formatHealthFactor, getHealthBarWidth } from "@/lib/utils";
import type { HealthStatus } from "@/types";

interface HealthBarProps {
  healthFactor: bigint;
  status: HealthStatus;
}

const valueColorMap: Record<HealthStatus, string> = {
  danger: "text-danger",
  warn: "text-warn",
  safe: "text-accent",
};

const fillColorMap: Record<HealthStatus, string> = {
  danger: "bg-danger",
  warn: "bg-warn",
  safe: "bg-accent",
};

export function HealthBar({ healthFactor, status }: HealthBarProps) {
  const width = getHealthBarWidth(healthFactor);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[11px] text-text-3 tracking-wider uppercase">
          Health Factor
        </span>
        <span
          className={cn(
            "font-mono text-[16px] font-medium",
            valueColorMap[status],
          )}
        >
          {formatHealthFactor(healthFactor)}
        </span>
      </div>

      <div className="h-0.75 bg-raised rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            fillColorMap[status],
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
