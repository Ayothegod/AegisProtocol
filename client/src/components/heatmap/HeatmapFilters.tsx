import { cn } from "@/lib/utils";
import type { HeatmapFilter, HeatmapSort } from "@/hooks/useHeatmap";

interface HeatmapFiltersProps {
  filter: HeatmapFilter;
  sort: HeatmapSort;
  onFilter: (f: HeatmapFilter) => void;
  onSort: (s: HeatmapSort) => void;
  total: number;
  filtered: number;
}

const filterOptions: { label: string; value: HeatmapFilter }[] = [
  { label: "All", value: "all" },
  { label: "Safe", value: "safe" },
  { label: "Warning", value: "warn" },
  { label: "Danger", value: "danger" },
];

const sortOptions: { label: string; value: HeatmapSort }[] = [
  { label: "Health ↑", value: "health_asc" },
  { label: "Health ↓", value: "health_desc" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

export function HeatmapFilters({
  filter,
  sort,
  onFilter,
  onSort,
  total,
  filtered,
}: HeatmapFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        {/* status filter */}
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

        {/* sort */}
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as HeatmapSort)}
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

      <p className="font-mono text-[12px] text-text-3">
        Showing <span className="text-text">{filtered}</span> of {total}{" "}
        positions
      </p>
    </div>
  );
}
