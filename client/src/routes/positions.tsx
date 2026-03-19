import { PositionTable } from "#/components/positions/PositionTable";
import { PositionsHeader } from "#/components/positions/PositionsHeader";
import { PositionsSummaryBar } from "#/components/positions/PositionsSummaryBar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/positions")({
  component: PositionsPage,
});

function PositionsPage() {
  return (
    <>
      <PositionsHeader />
      <PositionsSummaryBar />
      <PositionTable />
    </>
  );
}
