import { HealthBar } from "@/components/shared/HealthBar";
import { StrategyBadge } from "@/components/shared/StrategyBadge";
import { cn, formatUSD } from "@/lib/utils";
import type { Position } from "@/types";

interface HeatmapPositionDetailProps {
  position: Position;
}

export function HeatmapPositionDetail({
  position,
}: HeatmapPositionDetailProps) {
  const {
    id,
    collateral,
    debt,
    threshold,
    strategy,
    healthFactor,
    status,
    createdAt,
  } = position;

  return (
    <div className="flex flex-col gap-4">
      {/* health */}
      <HealthBar healthFactor={healthFactor} status={status} />

      {/* strategy */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-text-3 tracking-wider uppercase">
          Strategy
        </span>
        <StrategyBadge strategy={strategy} />
      </div>

      {/* metrics */}
      <div className="flex flex-col gap-2">
        <DetailRow label="Collateral" value={formatUSD(collateral)} />
        <DetailRow label="Debt" value={formatUSD(debt)} />
        <DetailRow
          label="Threshold"
          value={`${(Number(threshold) / 100).toFixed(2)}×`}
        />
        <DetailRow
          label="Created"
          value={new Date(Number(createdAt) * 1000).toLocaleDateString()}
        />
      </div>

      {/* status badge */}
      <div
        className={cn(
          "px-4 py-3 rounded-sm border text-center",
          status === "danger"
            ? "bg-danger/10 border-danger/25"
            : status === "warn"
              ? "bg-warn/10 border-warn/25"
              : "bg-accent/10 border-accent/25",
        )}
      >
        <p
          className={cn(
            "text-[13px] font-semibold",
            status === "danger"
              ? "text-danger"
              : status === "warn"
                ? "text-warn"
                : "text-accent",
          )}
        >
          {status === "danger"
            ? "⚠ Guardian firing"
            : status === "warn"
              ? "◎ Approaching threshold"
              : "✓ Position healthy"}
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="font-mono text-[11px] text-text-3 tracking-wider uppercase">
        {label}
      </span>
      <span className="font-mono text-[13px] text-text">{value}</span>
    </div>
  );
}
