import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { SavesOverTimeChart } from "@/components/analytics/SavesOverTimeChart";
import { HealthDistributionChart } from "@/components/analytics/HealthDIstributionChart";
import { StrategyBreakdownChart } from "#/components/analytics/StategyBreakdownChart";
import { TopSavedPositions } from "#/components/analytics/TopSavedPosition";
import { ValueProtectedChart } from "#/components/analytics/ValueProtectedChart";
import { AnalyticsStatBar } from "#/components/analytics/AnalyticsStatBar";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <>
      <AnalyticsHeader />
      <AnalyticsStatBar />
      <div className="grid grid-cols-2 gap-4">
        <SavesOverTimeChart />
        <ValueProtectedChart />
      </div>
      <div className="grid grid-cols-[1fr_320px] gap-4">
        <HealthDistributionChart />
        <StrategyBreakdownChart />
      </div>
      <TopSavedPositions />
    </>
  );
}
