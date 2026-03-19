import { HealthBar } from "@/components/shared/HealthBar";
import { StatusPip } from "@/components/shared/StatusPip";
import { StrategyBadge } from "@/components/shared/StrategyBadge";
import { cn, formatUSD } from "@/lib/utils";
import type { Position } from "@/types";
import { PositionActionsMenu } from "./PositionActionsMenu";

interface PositionRowProps {
  position: Position;
}

const statusLabelMap = {
  safe: { label: "Safe", color: "text-accent" },
  warn: { label: "Warning", color: "text-warn" },
  danger: { label: "Danger", color: "text-danger" },
};

const borderMap = {
  safe: "border-l-accent/40",
  warn: "border-l-warn/40",
  danger: "border-l-danger/50",
};

export function PositionRow({ position }: PositionRowProps) {
  const { id, collateral, debt, threshold, strategy, healthFactor, status } =
    position;

  const statusMeta = statusLabelMap[status];

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4",
        "border-l-2 transition-colors duration-150",
        "hover:bg-raised cursor-pointer",
        borderMap[status],
      )}
    >
      {/* position id */}
      <div className="w-32 shrink-0">
        <p className="font-mono text-[13px] text-text font-medium">
          #{id.toString()}
        </p>
        <p className="font-mono text-[10px] text-text-3 mt-0.5">ETH / USDC</p>
      </div>

      {/* collateral */}
      <div className="w-36 shrink-0">
        <p className="font-mono text-[13px] text-text">
          {formatUSD(collateral)}
        </p>
      </div>

      {/* debt */}
      <div className="w-36 shrink-0">
        <p className="font-mono text-[13px] text-text">{formatUSD(debt)}</p>
      </div>

      {/* threshold */}
      <div className="w-24 shrink-0">
        <p className="font-mono text-[13px] text-text">
          {(Number(threshold) / 100).toFixed(2)}×
        </p>
      </div>

      {/* health bar */}
      <div className="flex-1 min-w-0">
        <HealthBar healthFactor={healthFactor} status={status} />
      </div>

      {/* strategy */}
      <div className="w-36 shrink-0">
        <StrategyBadge strategy={strategy} />
      </div>

      {/* status */}
      <div className="w-24 shrink-0 flex items-center gap-1.5">
        <StatusPip status={status} />
        <p className={cn("text-[12px] font-medium", statusMeta.color)}>
          {statusMeta.label}
        </p>
      </div>

      {/* actions */}
      <div className="w-24 shrink-0 flex justify-end">
        <PositionActionsMenu position={position} />
      </div>
    </div>
  );
}
