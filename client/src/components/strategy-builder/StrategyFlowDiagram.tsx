import { cn } from "@/lib/utils";
import type { StrategyDraft } from "@/hooks/useStrategyBuilder";

interface StrategyFlowDiagramProps {
  draft: StrategyDraft;
}

export function StrategyFlowDiagram({ draft }: StrategyFlowDiagramProps) {
  const actionLabel = {
    ALERT_ONLY: "Emit on-chain alert",
    AUTO_TOPUP: `Add ${draft.topupAmount}% collateral`,
    AUTO_REPAY: `Repay ${draft.repayAmount}% debt`,
  }[draft.strategy];

  const actionColor = {
    ALERT_ONLY: "border-[rgba(77,171,247,0.3)] text-[#6cb6f5]",
    AUTO_TOPUP: "border-accent/30 text-accent",
    AUTO_REPAY: "border-warn/30 text-warn",
  }[draft.strategy];

  return (
    <div className="bg-surface border border-border rounded-md p-5">
      <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-4">
        Execution Flow
      </p>

      <div className="flex flex-col items-center gap-0">
        <FlowNode
          label="Position health drops"
          sub="On-chain state change"
          color="border-border text-text-2"
        />
        <FlowArrow />
        <FlowNode
          label={`Health < ${(draft.threshold / 100).toFixed(2)}×`}
          sub="Threshold crossed"
          color="border-danger/30 text-danger"
        />
        <FlowArrow />
        <FlowNode
          label="Somnia Reactivity fires"
          sub="Native on-chain trigger"
          color="border-accent/30 text-accent"
        />
        <FlowArrow />
        <FlowNode
          label="GuardianMonitor detects"
          sub="_onEvent() called"
          color="border-accent/20 text-accent"
        />
        <FlowArrow />
        <FlowNode
          label="GuardianEngine executes"
          sub={actionLabel}
          color={actionColor}
        />
        <FlowArrow />
        <FlowNode
          label="Alert emitted on-chain"
          sub="AlertFeed updates live"
          color="border-border text-text-2"
        />
      </div>
    </div>
  );
}

function FlowNode({
  label,
  sub,
  color,
}: {
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className={cn(
        "w-full px-4 py-2.5 rounded-sm border text-center",
        "bg-bg",
        color,
      )}
    >
      <p className="text-[12px] font-medium">{label}</p>
      <p className="font-mono text-[10px] text-text-3 mt-0.5">{sub}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex flex-col items-center py-0.5">
      <div className="w-px h-3 bg-border-hi" />
      <div className="text-text-3 text-[10px] leading-none">▼</div>
    </div>
  );
}
