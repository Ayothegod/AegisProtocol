import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "#/components/dashboard/PageHeader";
import { SimulatorStrip } from "#/components/dashboard/SimulatorStrip";
import { PositionList } from "#/components/dashboard/PositionList";
import { AlertFeedPanel } from "#/components/dashboard/AlertFeedPanel";
import { ProtocolStats } from "#/components/dashboard/ProtocolStats";
import { RiskHeatmap } from "#/components/dashboard/RiskHeatmap";
import { StatCards } from "#/components/dashboard/StatsCards";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <PageHeader />
      <StatCards />
      <SimulatorStrip />

      <div className="grid grid-cols-[1fr_320px] gap-4">
        <PositionList />
        <div className="flex flex-col gap-4">
          <AlertFeedPanel />
          <ProtocolStats />
        </div>
      </div>

      <RiskHeatmap />
    </>
  );
}
