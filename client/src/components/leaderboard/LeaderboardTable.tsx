import { useState } from "react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAccount } from "wagmi";
import { LeaderboardRow } from "./LeaderboardRow";
import { LeaderboardRowSkeleton } from "./LeaderboardRowSkeleton";
import { cn } from "@/lib/utils";

type SortKey = "saves" | "topups" | "repays" | "value";

const HEADERS: { label: string; key: SortKey | null; width: string }[] = [
  { label: "Rank", key: null, width: "w-16" },
  { label: "Position", key: null, width: "w-40" },
  { label: "Saves", key: "saves", width: "w-24" },
  { label: "Top-ups", key: "topups", width: "w-24" },
  { label: "Repays", key: "repays", width: "w-24" },
  { label: "Protected", key: "value", width: "flex-1" },
];

export function LeaderboardTable() {
  const { data = [], isLoading } = useLeaderboard();
  const { address } = useAccount();
  const [sort, setSort] = useState<SortKey>("saves");

  const sorted = [...data].sort((a, b) => {
    if (sort === "saves") return b.totalSaves - a.totalSaves;
    if (sort === "topups") return b.totalTopups - a.totalTopups;
    if (sort === "repays") return b.totalRepays - a.totalRepays;
    if (sort === "value") return Number(b.valueProtected - a.valueProtected);
    return 0;
  });

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-4 px-5 py-3 bg-raised border-b border-border">
        {HEADERS.map((h) => (
          <button
            key={h.label}
            onClick={() => h.key && setSort(h.key)}
            className={cn(
              "font-mono text-[10px] tracking-wider uppercase text-left",
              h.width,
              h.key
                ? "cursor-pointer transition-colors hover:text-text-2"
                : "cursor-default",
              sort === h.key ? "text-accent" : "text-text-3",
            )}
          >
            {h.label}
            {sort === h.key && " ↓"}
          </button>
        ))}
      </div>

      {/* rows */}
      <div className="divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <LeaderboardRowSkeleton key={i} />
          ))
        ) : sorted.length === 0 ? (
          <EmptyLeaderboard />
        ) : (
          sorted.map((entry) => (
            <LeaderboardRow
              key={entry.positionId.toString()}
              entry={entry}
              isOwn={entry.owner.toLowerCase() === address?.toLowerCase()}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyLeaderboard() {
  return (
    <div className="py-20 text-center">
      <p className="text-[13px] text-text-3">No Guardian activity yet</p>
      <p className="font-mono text-[11px] text-text-3 mt-1">
        Rankings will appear as Guardian fires on-chain
      </p>
    </div>
  );
}
