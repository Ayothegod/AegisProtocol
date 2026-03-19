import { usePositions } from "@/hooks/usePositions";
import { useGuardianHistory } from "@/hooks/useGuardianHistory";
import { useMemo } from "react";
import { HealthBar } from "@/components/shared/HealthBar";
import { StrategyBadge } from "@/components/shared/StrategyBadge";
import { cn } from "@/lib/utils";

export function TopSavedPositions() {
  const { data: positions = [] } = usePositions();
  const { data: history = [] } = useGuardianHistory();

  const ranked = useMemo(() => {
    const saveCount: Record<string, number> = {};

    history.forEach((h) => {
      const key = h.positionId.toString();
      saveCount[key] = (saveCount[key] ?? 0) + 1;
    });

    return positions
      .map((p) => ({
        ...p,
        saves: saveCount[p.id.toString()] ?? 0,
      }))
      .sort((a, b) => b.saves - a.saves)
      .slice(0, 5);
  }, [positions, history]);

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">
          Most Saved Positions
        </p>
        <p className="font-mono text-[12px] text-text-3">
          Top 5 by Guardian actions
        </p>
      </div>

      {/* table header */}
      <div
        className="
        grid grid-cols-[40px_1fr_1fr_200px_120px_100px]
        gap-4 px-5 py-2.5
        bg-raised border-b border-border
      "
      >
        {["#", "Position", "Strategy", "Health", "Saves", "Status"].map((h) => (
          <p
            key={h}
            className="font-mono text-[10px] text-text-3 tracking-wider uppercase"
          >
            {h}
          </p>
        ))}
      </div>

      <div className="divide-y divide-border">
        {ranked.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-[13px] text-text-3">No history yet</p>
            <p className="font-mono text-[11px] text-text-3 mt-1">
              Guardian actions will appear here as they happen
            </p>
          </div>
        ) : (
          ranked.map((p, i) => (
            <div
              key={p.id.toString()}
              className="
                grid grid-cols-[40px_1fr_1fr_200px_120px_100px]
                gap-4 px-5 py-4
                hover:bg-raised transition-colors
              "
            >
              {/* rank */}
              <p
                className={cn(
                  "font-mono text-[14px] font-medium self-center",
                  i === 0
                    ? "text-accent"
                    : i === 1
                      ? "text-text-2"
                      : i === 2
                        ? "text-warn"
                        : "text-text-3",
                )}
              >
                {i + 1}
              </p>

              {/* position id */}
              <div className="self-center">
                <p className="font-mono text-[13px] text-text">
                  #{p.id.toString()}
                </p>
                <p className="font-mono text-[10px] text-text-3 mt-0.5">
                  ETH / USDC
                </p>
              </div>

              {/* strategy */}
              <div className="self-center">
                <StrategyBadge strategy={p.strategy} />
              </div>

              {/* health bar */}
              <div className="self-center">
                <HealthBar healthFactor={p.healthFactor} status={p.status} />
              </div>

              {/* saves */}
              <div className="self-center">
                <p className="font-mono text-[18px] text-accent leading-none">
                  {p.saves}
                </p>
                <p className="font-mono text-[10px] text-text-3 mt-0.5">
                  guardian actions
                </p>
              </div>

              {/* status */}
              <div className="self-center">
                <p
                  className={cn(
                    "text-[12px] font-medium",
                    p.status === "danger"
                      ? "text-danger"
                      : p.status === "warn"
                        ? "text-warn"
                        : "text-accent",
                  )}
                >
                  {p.status === "danger"
                    ? "Danger"
                    : p.status === "warn"
                      ? "Warning"
                      : "Safe"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
