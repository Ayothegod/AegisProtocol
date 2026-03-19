const legend = [
  { label: "Critical  (<1.1×)", color: "bg-danger opacity-90" },
  { label: "Danger  (1.1–1.2×)", color: "bg-danger opacity-60" },
  { label: "Warning  (1.2–1.35×)", color: "bg-warn opacity-60" },
  { label: "Caution  (1.35–1.5×)", color: "bg-warn opacity-35" },
  { label: "Healthy  (1.5–2.0×)", color: "bg-accent opacity-35" },
  { label: "Safe  (2.0–2.5×)", color: "bg-accent opacity-65" },
  { label: "Very Safe  (>2.5×)", color: "bg-accent opacity-90" },
  { label: "Empty", color: "bg-border-hi opacity-40" },
];

export function HeatmapLegend() {
  return (
    <div className="flex items-center gap-4 mt-5 flex-wrap">
      {legend.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded-sm ${color}`} />
          <span className="font-mono text-[10px] text-text-3">{label}</span>
        </div>
      ))}
    </div>
  );
}
