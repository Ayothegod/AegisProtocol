import { cn, formatHealthFactor } from "@/lib/utils";
import { StrategyBadge } from "@/components/shared/StrategyBadge";
import { StatusPip } from "@/components/shared/StatusPip";
import type { Position } from "@/types";

interface PositionSelectorProps {
  positions: Position[];
  selected: Position | null;
  onSelect: (p: Position) => void;
}

export function PositionSelector({
  positions,
  selected,
  onSelect,
}: PositionSelectorProps) {
  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Select Position</p>
        <p className="font-mono text-[11px] text-text-3 mt-0.5">
          Choose which position to configure
        </p>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
        {positions.length === 0 && (
          <div className="col-span-2 py-10 text-center">
            <p className="text-[13px] text-text-3">
              No positions registered yet
            </p>
          </div>
        )}
        {positions.map((p) => (
          <button
            key={p.id.toString()}
            onClick={() => onSelect(p)}
            className={cn(
              "p-3 rounded-sm border text-left",
              "transition-colors duration-150 cursor-pointer",
              selected?.id === p.id
                ? "bg-accent/10 border-accent/30"
                : "bg-bg border-border hover:border-border-hi hover:bg-raised",
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <StatusPip status={p.status} />
                <span className="font-mono text-[12px] text-text font-medium">
                  #{p.id.toString()}
                </span>
              </div>
              <StrategyBadge strategy={p.strategy} />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-text-3">
                Health Factor
              </span>
              <span
                className={cn(
                  "font-mono text-[13px] font-medium",
                  p.status === "danger"
                    ? "text-danger"
                    : p.status === "warn"
                      ? "text-warn"
                      : "text-accent",
                )}
              >
                {formatHealthFactor(p.healthFactor)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
