import { cn } from "@/lib/utils";
import type { SimulatorState } from "@/hooks/useSimulator";

interface SimulatorControlsProps {
  sim: SimulatorState;
}

export function SimulatorControls({ sim }: SimulatorControlsProps) {
  const {
    selectedPosition,
    collateralDrop,
    setCollateralDrop,
    debtIncrease,
    setDebtIncrease,
    isRunning,
    hasRun,
    runSimulation,
    reset,
  } = sim;

  const dropColor =
    collateralDrop > 50
      ? "text-danger"
      : collateralDrop > 25
        ? "text-warn"
        : "text-accent";

  const debtColor =
    debtIncrease > 50
      ? "text-danger"
      : debtIncrease > 25
        ? "text-warn"
        : "text-text-2";

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">
          Simulation Parameters
        </p>
        <p className="font-mono text-[11px] text-text-3 mt-0.5">
          Adjust variables and run the simulation
        </p>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* collateral drop */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] font-medium text-text">
                Collateral Drop
              </p>
              <p className="font-mono text-[11px] text-text-3 mt-0.5">
                Simulate a decrease in collateral value
              </p>
            </div>
            <p
              className={cn(
                "font-mono text-[28px] leading-none transition-colors",
                dropColor,
              )}
            >
              −{collateralDrop}%
            </p>
          </div>

          <input
            type="range"
            min={0}
            max={80}
            value={collateralDrop}
            onChange={(e) => setCollateralDrop(Number(e.target.value))}
            disabled={isRunning}
            className="w-full h-0.5 cursor-pointer disabled:opacity-50"
            style={{ accentColor: "var(--color-accent)" }}
          />

          <div className="flex justify-between mt-1">
            <span className="font-mono text-[10px] text-text-3">0%</span>
            <span className="font-mono text-[10px] text-text-3">80%</span>
          </div>
        </div>

        {/* debt increase */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] font-medium text-text">Debt Increase</p>
              <p className="font-mono text-[11px] text-text-3 mt-0.5">
                Simulate additional debt being taken on
              </p>
            </div>
            <p
              className={cn(
                "font-mono text-[28px] leading-none transition-colors",
                debtColor,
              )}
            >
              +{debtIncrease}%
            </p>
          </div>

          <input
            type="range"
            min={0}
            max={80}
            value={debtIncrease}
            onChange={(e) => setDebtIncrease(Number(e.target.value))}
            disabled={isRunning}
            className="w-full h-0.5 cursor-pointer disabled:opacity-50"
            style={{ accentColor: "var(--color-warn)" }}
          />

          <div className="flex justify-between mt-1">
            <span className="font-mono text-[10px] text-text-3">0%</span>
            <span className="font-mono text-[10px] text-text-3">80%</span>
          </div>
        </div>

        {/* action buttons */}
        <div className="flex gap-3">
          <button
            onClick={runSimulation}
            disabled={!selectedPosition || isRunning}
            className="
              flex-1 py-3
              bg-accent text-[#0a0e00]
              text-[14px] font-semibold rounded-md
              hover:bg-[#d4f55a]
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all cursor-pointer
            "
          >
            {isRunning ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="
                  w-3.5 h-3.5 border-2 border-[#0a0e00]/30
                  border-t-[#0a0e00] rounded-full animate-spin
                "
                />
                Simulating…
              </span>
            ) : hasRun ? (
              "Run Again"
            ) : (
              "Run Simulation"
            )}
          </button>

          {hasRun && (
            <button
              onClick={reset}
              className="
                px-4 py-3 text-[13px] font-medium
                bg-transparent border border-border rounded-md
                text-text-2 hover:border-border-hi hover:text-text
                transition-colors cursor-pointer
              "
            >
              Reset
            </button>
          )}
        </div>

        {!selectedPosition && (
          <p className="font-mono text-[11px] text-text-3 text-center">
            Select a position above to run the simulation
          </p>
        )}
      </div>
    </div>
  );
}
