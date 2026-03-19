import { HeatmapGrid } from "@/components/heatmap/HeatmapGrid";
import { HeatmapHeader } from "@/components/heatmap/HeatmapHeader";
import { HeatmapSidebar } from "@/components/heatmap/HeatmapSidebar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/heatmap")({
  component: HeatmapPage,
});

function HeatmapPage() {
  return (
    <>
      <HeatmapHeader />
      <div className="grid grid-cols-[1fr_300px] gap-4">
        <div className="flex flex-col gap-4">
          {/* <HeatmapFilters /> */}
          <HeatmapGrid />
        </div>
        <HeatmapSidebar />
      </div>
    </>
  );
}
