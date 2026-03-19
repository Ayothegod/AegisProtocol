import { useLeaderboard } from "@/hooks/useLeaderboard";
import { formatUSD } from "@/lib/utils";
import { useMemo } from "react";

export function LeaderboardStats() {
  const { data = [] } = useLeaderboard();

  const stats = useMemo(() => {
    const totalSaves = data.reduce((acc, e) => acc + e.totalSaves, 0);
    const totalTopups = data.reduce((acc, e) => acc + e.totalTopups, 0);
    const totalRepays = data.reduce((acc, e) => acc + e.totalRepays, 0);
    const totalProtected = data.reduce((acc, e) => acc + e.valueProtected, 0n);

    return { totalSaves, totalTopups, totalRepays, totalProtected };
  }, [data]);

  return (
    <div className="grid grid-cols-4 gap-3">
      <StatTile
        label="Total Saves"
        value={stats.totalSaves.toString()}
        color="text-accent"
      />
      <StatTile
        label="Top-ups Executed"
        value={stats.totalTopups.toString()}
        color="text-accent"
      />
      <StatTile
        label="Repays Executed"
        value={stats.totalRepays.toString()}
        color="text-warn"
      />
      <StatTile
        label="Value Protected"
        value={formatUSD(stats.totalProtected)}
        color="text-text"
      />
    </div>
  );
}

function StatTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="px-5 py-4 bg-surface border border-border rounded-md">
      <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-2">
        {label}
      </p>
      <p className={`font-mono text-[30px] leading-none ${color}`}>{value}</p>
    </div>
  );
}
