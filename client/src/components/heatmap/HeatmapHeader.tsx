import { usePositions } from "@/hooks/usePositions";

export function HeatmapHeader() {
  const { data: positions = [] } = usePositions();

  const danger = positions.filter((p) => p.status === "danger").length;
  const warn = positions.filter((p) => p.status === "warn").length;

  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="font-mono text-[12px] text-text-3 tracking-widest uppercase mb-1">
          Guardian · Insights
        </p>
        <h1
          className="text-[36px] leading-none tracking-tight text-text"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          Risk{" "}
          <em className="text-accent" style={{ fontStyle: "italic" }}>
            heatmap.
          </em>
        </h1>
        <p className="text-[13px] text-text-2 mt-2">
          Visual overview of all monitored positions by risk level.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {danger > 0 && (
          <div
            className="
            flex items-center gap-2 px-4 py-2
            bg-danger/10 border border-danger/25
            rounded-md
          "
          >
            <span
              className="
              w-1.25 h-1.25 rounded-full bg-danger
              shadow-[0_0_6px_var(--color-danger)]
              animate-pulse
            "
            />
            <span className="font-mono text-[12px] text-danger">
              {danger} in danger
            </span>
          </div>
        )}
        {warn > 0 && (
          <div
            className="
            flex items-center gap-2 px-4 py-2
            bg-warn/10 border border-warn/25
            rounded-md
          "
          >
            <span className="w-1.25 h-1.25 rounded-full bg-warn" />
            <span className="font-mono text-[12px] text-warn">
              {warn} at warning
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
