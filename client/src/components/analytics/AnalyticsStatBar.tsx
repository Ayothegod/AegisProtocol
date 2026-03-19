import { useAnalytics } from "@/hooks/useAnalytics";

export function AnalyticsStatBar() {
  const { data } = useAnalytics();

  const tiles = [
    {
      label: "Total Saves",
      value: data?.totalSaves ?? 0,
      color: "text-accent",
    },
    {
      label: "Alerts Fired",
      value: data?.totalAlerts ?? 0,
      color: "text-danger",
    },
    {
      label: "Top-ups Done",
      value: data?.totalTopups ?? 0,
      color: "text-accent",
    },
    { label: "Repays Done", value: data?.totalRepays ?? 0, color: "text-warn" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {tiles.map(({ label, value, color }) => (
        <div
          key={label}
          className="px-5 py-4 bg-surface border border-border rounded-md"
        >
          <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-2">
            {label}
          </p>
          <p className={`font-mono text-[32px] leading-none ${color}`}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
