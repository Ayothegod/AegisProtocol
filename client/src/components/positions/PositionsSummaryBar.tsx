import { usePositions } from "@/hooks/usePositions";
import { cn } from "@/lib/utils";

export function PositionsSummaryBar() {
  const { data: positions = [] } = usePositions();

  const safe = positions.filter((p) => p.status === "safe").length;
  const warn = positions.filter((p) => p.status === "warn").length;
  const danger = positions.filter((p) => p.status === "danger").length;
  const total = positions.length;

  const tiles = [
    { label: "Total", value: total, color: "text-text" },
    { label: "Safe", value: safe, color: "text-accent" },
    { label: "Warning", value: warn, color: "text-warn" },
    { label: "Danger", value: danger, color: "text-danger" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {tiles.map(({ label, value, color }) => (
        <div
          key={label}
          className="
            flex items-center justify-between
            px-4 py-3
            bg-surface border border-border rounded-md
          "
        >
          <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase">
            {label}
          </p>
          <p className={cn("font-mono text-[22px] leading-none", color)}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
