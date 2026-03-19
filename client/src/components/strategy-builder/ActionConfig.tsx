import { cn } from "@/lib/utils";
import type { StrategyDraft } from "@/hooks/useStrategyBuilder";

interface ActionConfigProps {
  draft: StrategyDraft;
  onChange: (patch: Partial<StrategyDraft>) => void;
}

export function ActionConfig({ draft, onChange }: ActionConfigProps) {
  if (draft.strategy === "ALERT_ONLY") {
    return (
      <div
        className="
        p-5 bg-surface border border-border rounded-md
        flex items-start gap-3
      "
      >
        <span className="text-[#6cb6f5] text-[18px] mt-0.5">◎</span>
        <div>
          <p className="text-[13px] font-medium text-text mb-1">
            Alert Only — No action config needed
          </p>
          <p className="text-[12px] text-text-2 leading-relaxed">
            Guardian will emit an on-chain event when your position reaches the
            trigger threshold. Monitor the Alert Feed to stay informed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">
          {draft.strategy === "AUTO_TOPUP"
            ? "Top-up Configuration"
            : "Repay Configuration"}
        </p>
        <p className="font-mono text-[11px] text-text-3 mt-0.5">
          {draft.strategy === "AUTO_TOPUP"
            ? "How much collateral to add when Guardian fires"
            : "How much debt to repay when Guardian fires"}
        </p>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {draft.strategy === "AUTO_TOPUP" && (
          <AmountSlider
            label="Top-up Amount"
            sub="Percentage of current collateral to add"
            value={draft.topupAmount}
            onChange={(v) => onChange({ topupAmount: v })}
            color="accent"
            suffix="% of collateral"
          />
        )}

        {draft.strategy === "AUTO_REPAY" && (
          <AmountSlider
            label="Repay Amount"
            sub="Percentage of current debt to repay"
            value={draft.repayAmount}
            onChange={(v) => onChange({ repayAmount: v })}
            color="warn"
            suffix="% of debt"
          />
        )}

        {/* info box */}
        <div
          className="
          p-3 bg-bg border border-border rounded-sm
          font-mono text-[11px] text-text-3 leading-relaxed
        "
        >
          💡 Guardian executes this action automatically the moment your health
          factor drops below the trigger threshold — no bots, no off-chain
          servers. Powered entirely by Somnia native reactivity.
        </div>
      </div>
    </div>
  );
}

function AmountSlider({
  label,
  sub,
  value,
  onChange,
  color,
  suffix,
}: {
  label: string;
  sub: string;
  value: number;
  onChange: (v: number) => void;
  color: "accent" | "warn";
  suffix: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[13px] font-medium text-text">{label}</p>
          <p className="font-mono text-[11px] text-text-3 mt-0.5">{sub}</p>
        </div>
        <p
          className={cn(
            "font-mono text-[22px] leading-none",
            color === "accent" ? "text-accent" : "text-warn",
          )}
        >
          {value}%
        </p>
      </div>

      <input
        type="range"
        min={5}
        max={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "w-full h-0.5 cursor-pointer",
          color === "accent" ? "accent-accent" : "accent-warn",
        )}
      />

      <div className="flex justify-between mt-1">
        <span className="font-mono text-[10px] text-text-3">5%</span>
        <span className="font-mono text-[10px] text-text-3">50%</span>
      </div>
    </div>
  );
}
