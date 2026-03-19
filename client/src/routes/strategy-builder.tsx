import { createFileRoute } from "@tanstack/react-router";
import { StrategyBuilderHeader } from "@/components/strategy-builder/StrategyBuilderHeader";
import { StrategyBuilderGrid } from "#/components/strategy-builder/StrategyBuilderGrid";
import { StrategyPreview } from "#/components/strategy-builder/StrategyPreview";

export const Route = createFileRoute("/strategy-builder")({
  component: StrategyBuilderPage,
});

function StrategyBuilderPage() {
  return (
    <>
      <StrategyBuilderHeader />
      <div className="grid grid-cols-[1fr_360px] gap-4">
        <StrategyBuilderGrid />
        <StrategyPreview />
      </div>
    </>
  );
}
