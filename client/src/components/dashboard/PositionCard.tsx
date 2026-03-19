import { cn, formatUSD } from "@/lib/utils";
import type { Position } from "@/types";
import { HealthBar } from "../shared/HealthBar";
import { StrategyBadge } from "../shared/StrategyBadge";

interface PositionCardProps {
  position: Position;
}

const borderColorMap = {
  danger: "border-danger/20",
  warn: "border-warn/15",
  safe: "border-border",
};

const sidebarColorMap = {
  danger: "bg-danger",
  warn: "bg-warn",
  safe: "bg-accent opacity-50",
};

export function PositionCard({ position }: PositionCardProps) {
  const { id, collateral, debt, threshold, strategy, healthFactor, status } =
    position;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "p-3.5 bg-bg border rounded-sm",
        "cursor-pointer transition-colors duration-150",
        "hover:border-border-hi hover:bg-raised",
        borderColorMap[status],
      )}
    >
      {/* left status bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-0.5",
          sidebarColorMap[status],
        )}
      />

      {/* top row */}
      <div className="flex items-center justify-between mb-2.5 pl-1">
        <div className="flex items-center">
          <span className="font-mono text-[12px] text-text-3">
            #{id.toString()} ·
          </span>
          <span className="text-[14px] font-semibold text-text ml-2">
            {formatPair(collateral, debt)}
          </span>
        </div>
        <StrategyBadge strategy={strategy} />
      </div>

      {/* metrics */}
      <div className="grid grid-cols-3 gap-1 mb-2.5 pl-1">
        <Metric label="Collateral" value={formatUSD(collateral)} />
        <Metric label="Debt" value={formatUSD(debt)} />
        <Metric label="Threshold" value={`${Number(threshold) / 100}×`} />
      </div>

      {/* health bar */}
      <div className="pl-1">
        <HealthBar healthFactor={healthFactor} status={status} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-0.5">
        {label}
      </p>
      <p className="font-mono text-[14px] text-text">{value}</p>
    </div>
  );
}

function formatPair(collateral: bigint, debt: bigint): string {
  // placeholder — replace with real token symbols from contract
  return "ETH / USDC";
}
