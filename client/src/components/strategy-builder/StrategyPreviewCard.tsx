import { HealthBar } from "@/components/shared/HealthBar";
import { StrategyBadge } from "@/components/shared/StrategyBadge";
import type { StrategyDraft } from "@/hooks/useStrategyBuilder";
import { cn } from "@/lib/utils";
import type { Position } from "@/types";

interface StrategyPreviewCardProps {
  position: Position;
  draft: StrategyDraft;
}

export function StrategyPreviewCard({
  position,
  draft,
}: StrategyPreviewCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* position info */}
      <div className="p-3 bg-bg border border-border rounded-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[12px] text-text-2">
            #{position.id.toString()}
          </span>
          <StrategyBadge strategy={draft.strategy} />
        </div>
        <HealthBar
          healthFactor={position.healthFactor}
          status={position.status}
        />
      </div>

      {/* trigger summary */}
      <div className="flex flex-col gap-2">
        <SummaryRow
          label="Guardian fires at"
          value={`${(draft.threshold / 100).toFixed(2)}×`}
          color="text-danger"
        />
        <SummaryRow
          label="Warning alert at"
          value={`${(draft.alertThreshold / 100).toFixed(2)}×`}
          color="text-warn"
        />
        {draft.strategy === "AUTO_TOPUP" && (
          <SummaryRow
            label="Collateral added"
            value={`${draft.topupAmount}% of current`}
            color="text-accent"
          />
        )}
        {draft.strategy === "AUTO_REPAY" && (
          <SummaryRow
            label="Debt repaid"
            value={`${draft.repayAmount}% of current`}
            color="text-accent"
          />
        )}
        <SummaryRow
          label="Execution"
          value="On-chain · No bots"
          color="text-accent"
        />
      </div>
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
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="font-mono text-[11px] text-text-3 tracking-wider uppercase">
        {label}
      </span>
      <span className={cn("font-mono text-[13px] font-medium", color)}>
        {value}
      </span>
    </div>
  );
}
