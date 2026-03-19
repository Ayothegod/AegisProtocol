import { createFileRoute } from "@tanstack/react-router";
import { SimulatorHeader } from "@/components/simulator/SimulatorHeader";
import { SimulatorControls } from "@/components/simulator/SImulatorControls";
import { SimulatorResult } from "@/components/simulator/SimulatorResult";
import { SimulatorTimeline } from "@/components/simulator/SimulatorTimeline";
import { SimulatorPositionPicker } from "@/components/simulator/SimulatorPositionPicker";
import { useSimulator } from "@/hooks/useSimulator";

export const Route = createFileRoute("/simulator")({
  component: SimulatorPage,
});

function SimulatorPage() {
  const sim = useSimulator();

  return (
    <>
      <SimulatorHeader />
      <div className="grid grid-cols-[1fr_360px] gap-4">
        <div className="flex flex-col gap-4">
          <SimulatorPositionPicker
            selected={sim.selectedPosition}
            onSelect={sim.selectPosition}
          />
          <SimulatorControls sim={sim} />
          {sim.hasRun && <SimulatorTimeline sim={sim} />}
        </div>

        <SimulatorResult sim={sim} />
      </div>
    </>
  );
}
