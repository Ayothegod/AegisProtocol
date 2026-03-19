import { cn } from "@/lib/utils";
import { strategyLabel } from "@/lib/utils";
import type { Strategy } from "@/types";

interface StrategyBadgeProps {
  strategy: Strategy;
}

const styleMap: Record<Strategy, string> = {
  ALERT_ONLY:
    "bg-[rgba(77,171,247,0.1)] text-[#6cb6f5] border border-[rgba(77,171,247,0.18)]",
  AUTO_TOPUP: "bg-accent/10 text-accent border border-accent/20",
  AUTO_REPAY: "bg-warn/10 text-warn border border-warn/20",
};

export function StrategyBadge({ strategy }: StrategyBadgeProps) {
  return (
    <span
      className={cn(
        "text-[11px] font-semibold tracking-wider uppercase",
        "px-2.5 py-1 rounded-full",
        styleMap[strategy],
      )}
    >
      {strategyLabel(strategy)}
    </span>
  );
}
