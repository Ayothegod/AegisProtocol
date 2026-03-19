import { cn, formatAddress } from "@/lib/utils";
import type { LeaderboardEntry } from "@/hooks/useLeaderboard";

interface LeaderboardTopThreeProps {
  entries: LeaderboardEntry[];
}

const podiumConfig = [
  {
    rank: 1,
    height: "h-24",
    color: "text-accent",
    bg: "bg-accent/10  border-accent/25",
    icon: "◈",
  },
  {
    rank: 2,
    height: "h-16",
    color: "text-text-2",
    bg: "bg-raised     border-border",
    icon: "◇",
  },
  {
    rank: 3,
    height: "h-12",
    color: "text-warn",
    bg: "bg-warn/10    border-warn/25",
    icon: "△",
  },
];

export function LeaderboardTopThree({ entries }: LeaderboardTopThreeProps) {
  if (entries.length === 0) return null;

  // reorder for podium display: 2nd, 1st, 3rd
  const display = [entries[1] ?? null, entries[0] ?? null, entries[2] ?? null];
  const configs = [podiumConfig[1], podiumConfig[0], podiumConfig[2]];

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Top 3</p>
      </div>

      <div className="px-5 pt-4 pb-5">
        {/* podium bars */}
        <div className="flex items-end justify-center gap-3 mb-4 h-28">
          {display.map((entry, i) => {
            const config = configs[i];
            if (!entry) return <div key={i} className="w-20" />;
            return (
              <div
                key={entry.positionId.toString()}
                className="flex flex-col items-center gap-1.5"
              >
                <p className={cn("font-mono text-[10px]", config.color)}>
                  {entry.totalSaves} saves
                </p>
                <div
                  className={cn(
                    "w-16 rounded-t-sm border flex items-end justify-center pb-1",
                    config.height,
                    config.bg,
                  )}
                >
                  <span className={cn("font-mono text-[18px]", config.color)}>
                    {config.icon}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* names below podium */}
        <div className="flex justify-center gap-3">
          {display.map((entry, i) => {
            const config = configs[i];
            if (!entry) return <div key={i} className="w-20" />;
            return (
              <div
                key={entry.positionId.toString()}
                className="w-20 text-center"
              >
                <p
                  className={cn(
                    "font-mono text-[11px] font-medium",
                    config.color,
                  )}
                >
                  #{entry.positionId.toString()}
                </p>
                <p className="font-mono text-[9px] text-text-3 mt-0.5 truncate">
                  {formatAddress(entry.owner)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
