import { HealthBar } from "@/components/shared/HealthBar";
import { StrategyBadge } from "@/components/shared/StrategyBadge";
import type { SimulatorState } from "@/hooks/useSimulator";
import { cn } from "@/lib/utils";

interface SimulatorResultProps {
  sim: SimulatorState;
}

export function SimulatorResult({ sim }: SimulatorResultProps) {
  const {
    selectedPosition,
    collateralDrop,
    debtIncrease,
    hasRun,
    isRunning,
    finalStatus,
    guardianWouldFire,
    steps,
  } = sim;

  return (
    <div className="flex flex-col gap-4">
      {/* outcome card */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p className="text-[14px] font-semibold text-text">Outcome</p>
          <p className="font-mono text-[11px] text-text-3 mt-0.5">
            What would happen to this position
          </p>
        </div>

        <div className="p-5">
          {!hasRun && !isRunning ? (
            <div className="py-12 text-center">
              <p className="text-[28px] mb-3">⚗</p>
              <p className="text-[13px] text-text-3">
                Configure parameters and run the simulation
              </p>
            </div>
          ) : isRunning ? (
            <div className="py-12 text-center">
              <div
                className="
                    w-8 h-8 border-2 border-border-hi
                    border-t-accent rounded-full animate-spin
                    mx-auto mb-3
                  "
              />
              <p className="font-mono text-[12px] text-text-3">
                Running simulation…
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* guardian verdict */}
              <div
                className={cn(
                  "px-4 py-4 rounded-md border text-center",
                  guardianWouldFire
                    ? "bg-danger/10 border-danger/30"
                    : "bg-accent/10 border-accent/25",
                )}
              >
                <p className="text-[28px] mb-2">
                  {guardianWouldFire ? "⚡" : "✓"}
                </p>
                <p
                  className={cn(
                    "text-[15px] font-semibold",
                    guardianWouldFire ? "text-danger" : "text-accent",
                  )}
                >
                  {guardianWouldFire
                    ? "Guardian would fire"
                    : "Position stays safe"}
                </p>
                <p className="font-mono text-[11px] text-text-3 mt-1.5">
                  {guardianWouldFire
                    ? `Strategy: ${selectedPosition?.strategy.replace("_", " ")}`
                    : "No Guardian action needed"}
                </p>
              </div>

              {/* final health factor */}
              {finalStatus && steps.length > 0 && (
                <div>
                  <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-2">
                    Final Health Factor
                  </p>
                  <HealthBar
                    healthFactor={BigInt(
                      Math.round(steps[steps.length - 1].healthFactor * 1e18),
                    )}
                    status={finalStatus}
                  />
                </div>
              )}

              {/* scenario summary */}
              <div className="flex flex-col gap-1.5">
                <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-1">
                  Scenario
                </p>
                <SummaryRow
                  label="Collateral Drop"
                  value={`−${collateralDrop}%`}
                  color={
                    collateralDrop > 50
                      ? "text-danger"
                      : collateralDrop > 25
                        ? "text-warn"
                        : "text-text"
                  }
                />
                <SummaryRow
                  label="Debt Increase"
                  value={`+${debtIncrease}%`}
                  color={debtIncrease > 25 ? "text-warn" : "text-text"}
                />
                {selectedPosition && (
                  <SummaryRow
                    label="Strategy"
                    value={selectedPosition.strategy.replace("_", " ")}
                    color="text-text"
                  />
                )}
                <SummaryRow
                  label="Guardian Fires"
                  value={guardianWouldFire ? "Yes" : "No"}
                  color={guardianWouldFire ? "text-danger" : "text-accent"}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* position reference card */}
      {selectedPosition && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <p className="text-[14px] font-semibold text-text">
              Position #{selectedPosition.id.toString()}
            </p>
            <p className="font-mono text-[11px] text-text-3 mt-0.5">
              Current state — before simulation
            </p>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <HealthBar
              healthFactor={selectedPosition.healthFactor}
              status={selectedPosition.status}
            />
            <StrategyBadge strategy={selectedPosition.strategy} />
            <div className="flex flex-col gap-1.5">
              <SummaryRow
                label="Collateral"
                value={`${(Number(selectedPosition.collateral) / 1e18).toFixed(2)} ETH`}
                color="text-text"
              />
              <SummaryRow
                label="Debt"
                value={`${(Number(selectedPosition.debt) / 1e18).toFixed(2)} ETH`}
                color="text-text"
              />
              <SummaryRow
                label="Threshold"
                value={`${(Number(selectedPosition.threshold) / 100).toFixed(2)}×`}
                color="text-text"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <span className="font-mono text-[11px] text-text-3 tracking-wider uppercase">
        {label}
      </span>
      <span className={cn("font-mono text-[13px] font-medium", color)}>
        {value}
      </span>
    </div>
  );
}
