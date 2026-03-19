import { useHeatmap } from "@/hooks/useHeatmap";
import { HeatmapPositionDetail } from "./HeatmapPositionDetail";
import { HeatmapRiskSummary } from "./HeatmapRIskSummary";

export function HeatmapSidebar() {
  const { selected, positions } = useHeatmap();

  return (
    <div className="flex flex-col gap-4">
      {/* selected position detail */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p className="text-[14px] font-semibold text-text">
            {selected
              ? `Position #${selected.id.toString()}`
              : "Position Detail"}
          </p>
          <p className="font-mono text-[11px] text-text-3 mt-0.5">
            {selected ? "Click a cell to inspect" : "Click any cell to inspect"}
          </p>
        </div>

        <div className="p-5">
          {selected ? (
            <HeatmapPositionDetail position={selected} />
          ) : (
            <EmptyDetail />
          )}
        </div>
      </div>

      {/* risk summary */}
      <HeatmapRiskSummary positions={positions} />
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="py-10 text-center">
      <p className="text-[13px] text-text-3">No position selected</p>
      <p className="font-mono text-[11px] text-text-3 mt-1">
        Hover and click a cell on the heatmap
      </p>
    </div>
  );
}
