import { usePositions } from "@/hooks/usePositions";
import { HeatCell } from "./HeatCell";
import { cn } from "@/lib/utils";

const GRID_SIZE = 20;

export function RiskHeatmap() {
  const { data: positions = [] } = usePositions();

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Risk Heatmap</p>
        <p className="font-mono text-[12px] text-text-3">
          All positions · hover to inspect
        </p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: GRID_SIZE }).map((_, i) => {
            const position = positions[i];
            return <HeatCell key={i} position={position ?? null} />;
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {[
            { label: "Safe (>2.0×)", color: "bg-accent opacity-75" },
            { label: "Healthy (1.5–2.0×)", color: "bg-accent opacity-30" },
            { label: "Warning (1.2–1.5×)", color: "bg-warn opacity-55" },
            { label: "Danger (<1.2×)", color: "bg-danger opacity-75" },
            { label: "Empty", color: "bg-border-hi" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-sm", color)} />
              <span className="font-mono text-[11px] text-text-3">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
