import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/types";
import type { Strategy } from "@/types";

export type FilterStatus = HealthStatus | "all";
export type FilterStrategy = Strategy | "all";
export type SortKey = "health_asc" | "health_desc" | "newest" | "oldest";

interface PositionFiltersProps {
  status: FilterStatus;
  strategy: FilterStrategy;
  sort: SortKey;
  onStatus: (v: FilterStatus) => void;
  onStrategy: (v: FilterStrategy) => void;
  onSort: (v: SortKey) => void;
  search: string;
  onSearch: (v: string) => void;
}

const statusOptions: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Safe", value: "safe" },
  { label: "Warning", value: "warn" },
  { label: "Danger", value: "danger" },
];

const strategyOptions: { label: string; value: FilterStrategy }[] = [
  { label: "All Strategies", value: "all" },
  { label: "Alert Only", value: "ALERT_ONLY" },
  { label: "Auto Top-up", value: "AUTO_TOPUP" },
  { label: "Auto Repay", value: "AUTO_REPAY" },
];

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Health ↑", value: "health_asc" },
  { label: "Health ↓", value: "health_desc" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

export function PositionFilters({
  status,
  strategy,
  sort,
  search,
  onStatus,
  onStrategy,
  onSort,
  onSearch,
}: PositionFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* search */}
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by ID or pair…"
        className="
          px-3 py-2 w-52
          bg-surface border border-border rounded-md
          font-mono text-[12px] text-text
          placeholder:text-text-3
          focus:outline-none focus:border-accent/40
          transition-colors
        "
      />

      {/* status filter */}
      <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-md">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatus(opt.value)}
            className={cn(
              "px-3 py-1.5 text-[12px] font-medium rounded-sm transition-colors cursor-pointer",
              status === opt.value
                ? "bg-raised text-text"
                : "text-text-3 hover:text-text-2",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* strategy filter */}
      <select
        value={strategy}
        onChange={(e) => onStrategy(e.target.value as FilterStrategy)}
        className="
          px-3 py-2
          bg-surface border border-border rounded-md
          font-mono text-[12px] text-text-2
          focus:outline-none focus:border-accent/40
          cursor-pointer transition-colors
        "
      >
        {strategyOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* sort */}
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value as SortKey)}
        className="
          px-3 py-2
          bg-surface border border-border rounded-md
          font-mono text-[12px] text-text-2
          focus:outline-none focus:border-accent/40
          cursor-pointer transition-colors
        "
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
