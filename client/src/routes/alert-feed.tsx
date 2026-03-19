import { AlertFeedHeader } from "@/components/alert-feed/AlertFeedHeader";
import { AlertFeedList } from "@/components/alert-feed/AlertFeedList";
import { AlertFeedStats } from "@/components/alert-feed/AlertFeedStats";
import { HistoryPanel } from "@/components/alert-feed/HistoryPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/alert-feed")({
  component: AlertFeedPage,
});

function AlertFeedPage() {
  return (
    <>
      <AlertFeedHeader />
      <AlertFeedStats />
      <div className="grid grid-cols-[1fr_340px] gap-4">
        <AlertFeedList />
        <HistoryPanel />
      </div>
    </>
  );
}
