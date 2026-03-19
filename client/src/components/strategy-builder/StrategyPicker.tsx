import { cn } from "@/lib/utils";
import type { Strategy } from "@/types";

interface StrategyPickerProps {
  value: Strategy;
  onChange: (s: Strategy) => void;
}

const options: {
  key: Strategy;
  label: string;
  description: string;
  icon: string;
  color: string;
  activeBg: string;
}[] = [
  {
    key: "ALERT_ONLY",
    label: "Alert Only",
    description:
      "Guardian emits an on-chain alert when threshold is hit. No automatic action taken.",
    icon: "◎",
    color: "text-[#6cb6f5]",
    activeBg: "bg-[rgba(77,171,247,0.1)] border-[rgba(77,171,247,0.3)]",
  },
  {
    key: "AUTO_TOPUP",
    label: "Auto Top-up",
    description:
      "Guardian automatically adds collateral to restore health factor above threshold.",
    icon: "↑",
    color: "text-accent",
    activeBg: "bg-accent/10 border-accent/30",
  },
  {
    key: "AUTO_REPAY",
    label: "Auto Repay",
    description:
      "Guardian automatically repays a portion of debt to restore health factor.",
    icon: "↓",
    color: "text-warn",
    activeBg: "bg-warn/10 border-warn/30",
  },
];

export function StrategyPicker({ value, onChange }: StrategyPickerProps) {
  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Guardian Strategy</p>
        <p className="font-mono text-[11px] text-text-3 mt-0.5">
          Choose how Guardian responds when your position is at risk
        </p>
      </div>

      <div className="p-3 grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={cn(
              "p-4 rounded-sm border text-left",
              "transition-all duration-150 cursor-pointer",
              value === opt.key
                ? opt.activeBg
                : "bg-bg border-border hover:border-border-hi hover:bg-raised",
            )}
          >
            <span className={cn("text-[20px] block mb-2", opt.color)}>
              {opt.icon}
            </span>
            <p
              className={cn(
                "text-[13px] font-semibold mb-1.5",
                value === opt.key ? opt.color : "text-text",
              )}
            >
              {opt.label}
            </p>
            <p className="text-[11px] text-text-3 leading-snug">
              {opt.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
