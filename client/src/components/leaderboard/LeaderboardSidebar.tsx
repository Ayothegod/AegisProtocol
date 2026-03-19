import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAccount } from "wagmi";
import { LeaderboardYourRank } from "./LeaderboardYourRank";
import { LeaderboardTopThree } from "./LeaderboardTopThree";

export function LeaderboardSidebar() {
  const { data = [] } = useLeaderboard();
  const { address } = useAccount();

  const yourEntry = data.find(
    (e) => e.owner.toLowerCase() === address?.toLowerCase(),
  );

  return (
    <div className="flex flex-col gap-4">
      <LeaderboardYourRank entry={yourEntry ?? null} />
      <LeaderboardTopThree entries={data.slice(0, 3)} />
    </div>
  );
}
