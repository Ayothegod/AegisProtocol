import type { StrategyDraft } from "@/hooks/useStrategyBuilder";

interface ThresholdConfigProps {
  draft: StrategyDraft;
  onChange: (patch: Partial<StrategyDraft>) => void;
}

export function ThresholdConfig({ draft, onChange }: ThresholdConfigProps) {
  const liquidationHf = (draft.threshold / 100).toFixed(2);
  const alertHf = (draft.alertThreshold / 100).toFixed(2);

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">
          Threshold Configuration
        </p>
        <p className="font-mono text-[11px] text-text-3 mt-0.5">
          Set the health factor levels that trigger Guardian
        </p>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* guardian trigger threshold */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] font-medium text-text">
                Guardian Trigger
              </p>
              <p className="font-mono text-[11px] text-text-3 mt-0.5">
                Guardian fires when health factor drops below this
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[22px] text-danger leading-none">
                {liquidationHf}×
              </p>
            </div>
          </div>

          <input
            type="range"
            min={100}
            max={200}
            value={draft.threshold}
            onChange={(e) => onChange({ threshold: Number(e.target.value) })}
            className="w-full h-0.5 accent-danger cursor-pointer"
          />

          <div className="flex justify-between mt-1">
            <span className="font-mono text-[10px] text-text-3">1.00×</span>
            <span className="font-mono text-[10px] text-text-3">2.00×</span>
          </div>
        </div>

        {/* alert threshold */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] font-medium text-text">Warning Alert</p>
              <p className="font-mono text-[11px] text-text-3 mt-0.5">
                Emit an early warning alert at this level
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[22px] text-warn leading-none">
                {alertHf}×
              </p>
            </div>
          </div>

          <input
            type="range"
            min={110}
            max={250}
            value={draft.alertThreshold}
            onChange={(e) =>
              onChange({ alertThreshold: Number(e.target.value) })
            }
            className="w-full h-0.5 accent-warn cursor-pointer"
          />

          <div className="flex justify-between mt-1">
            <span className="font-mono text-[10px] text-text-3">1.10×</span>
            <span className="font-mono text-[10px] text-text-3">2.50×</span>
          </div>
        </div>

        {/* visual health bar scale */}
        <div>
          <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-2">
            Threshold Visualizer
          </p>
          <div className="relative h-2 bg-raised rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-danger via-warn to-accent rounded-full" />

            {/* guardian trigger marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-danger"
              style={{ left: `${((draft.threshold - 100) / 100) * 100}%` }}
            />
            {/* alert marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-warn"
              style={{ left: `${((draft.alertThreshold - 100) / 150) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[10px] text-danger">Danger</span>
            <span className="font-mono text-[10px] text-warn">Warning</span>
            <span className="font-mono text-[10px] text-accent">Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
