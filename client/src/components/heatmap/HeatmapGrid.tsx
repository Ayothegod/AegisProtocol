import { useHeatmap } from "@/hooks/useHeatmap";
import { HeatmapFilters } from "./HeatmapFilters";
import { HeatmapCell } from "./HeatmapCell";
import { HeatmapLegend } from "./HeatmapLegend";
import { HeatmapGridSkeleton } from "./HeatmapGridSkeleton";

const GRID_COLS = 10;
const MIN_CELLS = 40;

export function HeatmapGrid() {
  const {
    positions,
    filtered,
    isLoading,
    filter,
    setFilter,
    sort,
    setSort,
    selected,
    setSelected,
  } = useHeatmap();

  // pad to minimum grid size so it always looks full
  const padded = [
    ...filtered,
    ...Array(Math.max(0, MIN_CELLS - filtered.length)).fill(null),
  ];

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      {/* filters inside panel */}
      <div className="px-5 py-3.5 border-b border-border">
        <HeatmapFilters
          filter={filter}
          onFilter={setFilter}
          sort={sort}
          onSort={setSort}
          total={positions.length}
          filtered={filtered.length}
        />
      </div>

      <div className="p-6">
        {isLoading ? (
          <HeatmapGridSkeleton />
        ) : (
          <>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
            >
              {padded.map((position, i) => (
                <HeatmapCell
                  key={position ? position.id.toString() : `empty-${i}`}
                  position={position}
                  isSelected={selected?.id === position?.id}
                  onSelect={setSelected}
                />
              ))}
            </div>

            <HeatmapLegend />
          </>
        )}
      </div>
    </div>
  );
}
