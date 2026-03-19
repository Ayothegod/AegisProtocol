import { getHealthStatus } from "@/lib/utils";
import type { HealthStatus, Position } from "@/types";
import { useState } from "react";
import { usePositions } from "./usePositions";

export interface SimStep {
  label: string;
  healthFactor: number;
  status: HealthStatus;
  event: string | null;
  guardianFired: boolean;
}

export interface SimulatorState {
  selectedPosition: Position | null;
  collateralDrop: number;
  debtIncrease: number;
  hasRun: boolean;
  isRunning: boolean;
  steps: SimStep[];
  finalStatus: HealthStatus | null;
  guardianWouldFire: boolean;
  selectPosition: (p: Position) => void;
  setCollateralDrop: (v: number) => void;
  setDebtIncrease: (v: number) => void;
  runSimulation: () => void;
  reset: () => void;
}

export function useSimulator(): SimulatorState {
  const { data: positions = [] } = usePositions();

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const [collateralDrop, setCollateralDrop] = useState(20);
  const [debtIncrease, setDebtIncrease] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<SimStep[]>([]);

  function selectPosition(p: Position) {
    setSelectedPosition(p);
    setHasRun(false);
    setSteps([]);
  }

  function reset() {
    setHasRun(false);
    setIsRunning(false);
    setSteps([]);
    setCollateralDrop(20);
    setDebtIncrease(0);
  }

  async function runSimulation() {
    if (!selectedPosition) return;

    setIsRunning(true);
    setHasRun(false);
    setSteps([]);

    const baseCollateral = Number(selectedPosition.collateral) / 1e18;
    const baseDebt = Number(selectedPosition.debt) / 1e18;
    const threshold = Number(selectedPosition.threshold) / 100;

    // build simulation steps
    const simSteps: SimStep[] = [];

    // step 1 — baseline
    const baseHF = baseCollateral / baseDebt;
    simSteps.push({
      label: "Baseline",
      healthFactor: baseHF,
      status: getHealthStatus(BigInt(Math.round(baseHF * 1e18))),
      event: "Position state recorded",
      guardianFired: false,
    });

    // step 2 — partial drop
    const midDrop = collateralDrop / 2;
    const midCollateral = baseCollateral * (1 - midDrop / 100);
    const midDebt = baseDebt * (1 + debtIncrease / 200);
    const midHF = midCollateral / midDebt;
    const midStatus = getHealthStatus(BigInt(Math.round(midHF * 1e18)));

    simSteps.push({
      label: `−${midDrop.toFixed(0)}% collateral`,
      healthFactor: midHF,
      status: midStatus,
      event: midStatus === "warn" ? "Warning threshold crossed" : null,
      guardianFired: false,
    });

    // step 3 — full drop
    const finalCollateral = baseCollateral * (1 - collateralDrop / 100);
    const finalDebt = baseDebt * (1 + debtIncrease / 100);
    const finalHF = finalCollateral / finalDebt;
    const finalStatus = getHealthStatus(BigInt(Math.round(finalHF * 1e18)));
    const guardianFired = finalHF < threshold;

    simSteps.push({
      label: `−${collateralDrop}% collateral${debtIncrease > 0 ? ` +${debtIncrease}% debt` : ""}`,
      healthFactor: finalHF,
      status: finalStatus,
      event: guardianFired ? "Guardian threshold crossed!" : null,
      guardianFired,
    });

    // step 4 — guardian response (if fired)
    if (guardianFired) {
      let postHF = finalHF;

      if (selectedPosition.strategy === "AUTO_TOPUP") {
        const topupAmount = finalCollateral * 0.1;
        const newCollateral = finalCollateral + topupAmount;
        postHF = newCollateral / finalDebt;
        simSteps.push({
          label: "Guardian: Top-up executed",
          healthFactor: postHF,
          status: getHealthStatus(BigInt(Math.round(postHF * 1e18))),
          event: `+${topupAmount.toFixed(2)} ETH collateral added`,
          guardianFired: false,
        });
      }

      if (selectedPosition.strategy === "AUTO_REPAY") {
        const repayAmount = finalDebt * 0.1;
        const newDebt = finalDebt - repayAmount;
        postHF = finalCollateral / newDebt;
        simSteps.push({
          label: "Guardian: Repay executed",
          healthFactor: postHF,
          status: getHealthStatus(BigInt(Math.round(postHF * 1e18))),
          event: `−${repayAmount.toFixed(2)} ETH debt repaid`,
          guardianFired: false,
        });
      }

      if (selectedPosition.strategy === "ALERT_ONLY") {
        simSteps.push({
          label: "Guardian: Alert emitted",
          healthFactor: finalHF,
          status: finalStatus,
          event: "On-chain alert event emitted",
          guardianFired: false,
        });
      }
    }

    // animate steps in one by one
    for (let i = 0; i < simSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setSteps((prev) => [...prev, simSteps[i]]);
    }

    setHasRun(true);
    setIsRunning(false);
  }

  const finalStatus = steps.length > 0 ? steps[steps.length - 1].status : null;
  const guardianWouldFire = steps.some((s) => s.guardianFired);

  return {
    selectedPosition,
    collateralDrop,
    debtIncrease,
    hasRun,
    isRunning,
    steps,
    finalStatus,
    guardianWouldFire,
    selectPosition,
    setCollateralDrop,
    setDebtIncrease,
    runSimulation,
    reset,
  };
}
