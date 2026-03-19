import { cn, formatUSD, formatAddress } from "@/lib/utils";
import type { LeaderboardEntry } from "@/hooks/useLeaderboard";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isOwn: boolean;
}

const rankStyle: Record<number, string> = {
  1: "text-accent text-[18px]",
  2: "text-text-2 text-[16px]",
  3: "text-warn text-[16px]",
};

const rankIcon: Record<number, string> = {
  1: "◈",
  2: "◇",
  3: "△",
};

export function LeaderboardRow({ entry, isOwn }: LeaderboardRowProps) {
  const {
    rank,
    positionId,
    owner,
    totalSaves,
    totalTopups,
    totalRepays,
    valueProtected,
  } = entry;

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4",
        "transition-colors duration-150 hover:bg-raised",
        isOwn && "bg-accent/5 border-l-2 border-l-accent/40",
      )}
    >
      {/* rank */}
      <div className="w-16 shrink-0 flex items-center gap-1.5">
        <span
          className={cn(
            "font-mono font-medium leading-none",
            rankStyle[rank] ?? "text-text-3 text-[14px]",
          )}
        >
          {rankIcon[rank] ?? rank}
        </span>
        {isOwn && (
          <span
            className="
            font-mono text-[9px] px-1.5 py-0.5
            bg-accent/15 text-accent
            border border-accent/25 rounded-full
            tracking-wider uppercase
          "
          >
            You
          </span>
        )}
      </div>

      {/* position */}
      <div className="w-40 shrink-0">
        <p className="font-mono text-[13px] text-text font-medium">
          #{positionId.toString()}
        </p>
        <p className="font-mono text-[10px] text-text-3 mt-0.5">
          {formatAddress(owner)}
        </p>
      </div>

      {/* saves */}
      <div className="w-24 shrink-0">
        <p className="font-mono text-[20px] text-accent leading-none">
          {totalSaves}
        </p>
        <p className="font-mono text-[10px] text-text-3 mt-0.5">saves</p>
      </div>

      {/* topups */}
      <div className="w-24 shrink-0">
        <p className="font-mono text-[20px] text-text leading-none">
          {totalTopups}
        </p>
        <p className="font-mono text-[10px] text-text-3 mt-0.5">top-ups</p>
      </div>

      {/* repays */}
      <div className="w-24 shrink-0">
        <p className="font-mono text-[20px] text-text leading-none">
          {totalRepays}
        </p>
        <p className="font-mono text-[10px] text-text-3 mt-0.5">repays</p>
      </div>

      {/* value protected */}
      <div className="flex-1">
        <p className="font-mono text-[18px] text-text leading-none">
          {formatUSD(valueProtected)}
        </p>
        <p className="font-mono text-[10px] text-text-3 mt-0.5">protected</p>
      </div>
    </div>
  );
}
