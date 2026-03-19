import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardStats } from "@/components/leaderboard/LeaderboardStats";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { LeaderboardSidebar } from "@/components/leaderboard/LeaderboardSidebar";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  return (
    <>
      <LeaderboardHeader />
      <LeaderboardStats />
      <div className="grid grid-cols-[1fr_300px] gap-4">
        <LeaderboardTable />
        <LeaderboardSidebar />
      </div>
    </>
  );
}
