import { useLeaderboard } from "@/hooks/useLeaderboard";

export function LeaderboardHeader() {
  const { data = [] } = useLeaderboard();

  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="font-mono text-[12px] text-text-3 tracking-widest uppercase mb-1">
          Guardian · Rankings
        </p>
        <h1
          className="text-[36px] leading-none tracking-tight text-text"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          Guardian{" "}
          <em className="text-accent" style={{ fontStyle: "italic" }}>
            leaderboard.
          </em>
        </h1>
        <p className="text-[13px] text-text-2 mt-2">
          Positions ranked by total Guardian saves — all verified on-chain.
        </p>
      </div>

      <div
        className="
        px-4 py-2.5
        bg-surface border border-border rounded-md
        font-mono text-[12px] text-text-2
      "
      >
        <span className="text-accent">{data.length}</span> positions on record
      </div>
    </div>
  );
}
