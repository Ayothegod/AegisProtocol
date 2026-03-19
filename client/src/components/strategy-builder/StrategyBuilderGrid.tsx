import { usePositions } from "@/hooks/usePositions";
import { useStrategyBuilder } from "@/hooks/useStrategyBuilder";
import { StrategyPicker } from "./StrategyPicker";
import { ThresholdConfig } from "./ThresholdConfig";
import { ActionConfig } from "./ActionConfig";
import { SaveStrategyButton } from "./SaveStrategyButton";
import { PositionSelector } from "./PositionSelector";

export function StrategyBuilderGrid() {
  const { data: positions = [] } = usePositions();
  const builder = useStrategyBuilder();

  return (
    <div className="flex flex-col gap-4">
      <PositionSelector
        positions={positions}
        selected={builder.selectedPosition}
        onSelect={builder.selectPosition}
      />

      {builder.selectedPosition && (
        <>
          <StrategyPicker
            value={builder.draft.strategy}
            onChange={(s) => builder.updateDraft({ strategy: s })}
          />
          <ThresholdConfig
            draft={builder.draft}
            onChange={builder.updateDraft}
          />
          <ActionConfig draft={builder.draft} onChange={builder.updateDraft} />
          <SaveStrategyButton
            isPending={builder.isPending}
            isConfirming={builder.isConfirming}
            isSuccess={builder.isSuccess}
            onSave={builder.saveStrategy}
          />
        </>
      )}
    </div>
  );
}
