import { useProtocolStats } from "#/hooks/useProtocolStats";
import { formatUSD } from "@/lib/utils";

export function ProtocolStats() {
  const { data: stats } = useProtocolStats();

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Protocol Stats</p>
        <p className="font-mono text-[12px] text-text-3">All time</p>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2">
        <StatTile
          label="Saves"
          value={stats?.positionsSaved.toString() ?? "—"}
          sub="liquidations prevented"
          accent
        />
        <StatTile label="Response" value="~1 blk" sub="somnia native speed" />
        <StatTile
          label="Value Saved"
          value={stats ? formatUSD(stats.valueProtected) : "—"}
          sub="total protected"
        />
        <StatTile
          label="Subscriptions"
          value={stats?.totalPositions.toString() ?? "—"}
          sub="on-chain active"
          accent
        />
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="p-3 bg-bg border border-border rounded-sm">
      <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-1.5">
        {label}
      </p>
      <p
        className={`font-mono text-[20px] leading-none ${accent ? "text-accent" : "text-text"}`}
      >
        {value}
      </p>
      <p className="font-mono text-[11px] text-text-3 mt-1">{sub}</p>
    </div>
  );
}
