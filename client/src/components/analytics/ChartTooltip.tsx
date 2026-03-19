interface ChartTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  valuePrefix?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  valuePrefix = "",
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="
      bg-raised border border-border-hi rounded-md
      px-3 py-2.5 shadow-xl
    "
    >
      <p className="font-mono text-[10px] text-text-3 mb-2 tracking-wider uppercase">
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center gap-2 mb-1 last:mb-0"
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="font-mono text-[11px] text-text-2">
            {entry.name}
          </span>
          <span className="font-mono text-[12px] text-text ml-2 font-medium">
            {valuePrefix}
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
