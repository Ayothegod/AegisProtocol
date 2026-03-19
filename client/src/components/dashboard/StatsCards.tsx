import { useProtocolStats } from "#/hooks/useProtocolStats";
import { formatUSD } from "@/lib/utils";
import { StatCard } from "./StatCard";

export function StatCards() {
  const { data: stats } = useProtocolStats();

  return (
    <div className="grid grid-cols-4 gap-3">
      <StatCard
        label="Positions"
        value={stats?.totalPositions ?? 0}
        delta="+2 this week"
        deltaType="positive"
        valueColor="plain"
      />
      <StatCard
        label="Saves"
        value={stats?.positionsSaved ?? 0}
        delta="+3 last 24h"
        deltaType="positive"
        valueColor="accent"
      />
      <StatCard
        label="At Risk"
        value={stats?.atRisk ?? 0}
        delta="+1 from yesterday"
        deltaType="negative"
        valueColor="danger"
      />
      <StatCard
        label="Protected"
        value={stats ? formatUSD(stats.valueProtected) : "$0"}
        delta="+$12K this week"
        deltaType="positive"
        valueColor="plain"
      />
    </div>
  );
}
