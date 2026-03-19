interface ChartPanelProps {
  title: string;
  sub?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartPanel({
  title,
  sub,
  children,
  className,
}: ChartPanelProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-md overflow-hidden ${className ?? ""}`}
    >
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">{title}</p>
        {sub && (
          <p className="font-mono text-[11px] text-text-3 mt-0.5">{sub}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
