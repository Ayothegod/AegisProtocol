import { cn } from "@/lib/utils";
import type { AlertEvent } from "@/types";

export type AlertFilter = AlertEvent["type"] | "all";

interface AlertFeedControlsProps {
  filter: AlertFilter;
  onFilter: (f: AlertFilter) => void;
  onClear: () => void;
  paused: boolean;
  onPause: () => void;
}

const filterOptions: { label: string; value: AlertFilter }[] = [
  { label: "All", value: "all" },
  { label: "Guardian Fired", value: "guardian_fired" },
  { label: "Top-ups", value: "topup_executed" },
  { label: "Repays", value: "repay_executed" },
  { label: "Breaches", value: "threshold_breach" },
  { label: "Registered", value: "registered" },
];

export function AlertFeedControls({
  filter,
  onFilter,
  onClear,
  paused,
  onPause,
}: AlertFeedControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* type filters */}
      <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-md">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilter(opt.value)}
            className={cn(
              "px-3 py-1.5 text-[12px] font-medium rounded-sm transition-colors cursor-pointer",
              filter === opt.value
                ? "bg-raised text-text"
                : "text-text-3 hover:text-text-2",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* pause/resume */}
        <button
          onClick={onPause}
          className={cn(
            "px-3 py-2 text-[12px] font-medium rounded-md border transition-colors cursor-pointer",
            paused
              ? "bg-accent/10 border-accent/25 text-accent"
              : "bg-surface border-border text-text-2 hover:border-border-hi",
          )}
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>

        {/* clear */}
        <button
          onClick={onClear}
          className="
            px-3 py-2 text-[12px] font-medium
            bg-surface border border-border rounded-md
            text-text-2 hover:text-danger hover:border-danger/30
            transition-colors cursor-pointer
          "
        >
          Clear Feed
        </button>
      </div>
    </div>
  );
}
