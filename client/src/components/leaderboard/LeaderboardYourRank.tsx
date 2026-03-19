import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/hooks/useLeaderboard";

interface LeaderboardYourRankProps {
  entry: LeaderboardEntry | null;
}

export function LeaderboardYourRank({ entry }: LeaderboardYourRankProps) {
  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Your Rank</p>
      </div>

      <div className="p-5">
        {!entry ? (
          <div className="py-8 text-center">
            <p className="text-[13px] text-text-3">Not ranked yet</p>
            <p className="font-mono text-[11px] text-text-3 mt-1">
              Guardian needs to fire on one of your positions
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* rank number */}
            <div className="text-center py-4">
              <p className="font-mono text-[64px] leading-none text-accent">
                #{entry.rank}
              </p>
              <p className="font-mono text-[12px] text-text-3 mt-2">
                of all positions
              </p>
            </div>

            {/* breakdown */}
            <div className="flex flex-col gap-2">
              <MiniStat
                label="Total Saves"
                value={entry.totalSaves}
                color="text-accent"
              />
              <MiniStat
                label="Top-ups Done"
                value={entry.totalTopups}
                color="text-accent"
              />
              <MiniStat
                label="Repays Done"
                value={entry.totalRepays}
                color="text-warn"
              />
              <MiniStat
                label="Alerts Fired"
                value={entry.totalAlerts}
                color="text-danger"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="font-mono text-[11px] text-text-3 tracking-wider uppercase">
        {label}
      </span>
      <span className={cn("font-mono text-[16px] font-medium", color)}>
        {value}
      </span>
    </div>
  );
}
