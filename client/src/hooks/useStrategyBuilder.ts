import { positionRegistryAbi } from "@/lib/abis/PositionRegistry.abi";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import type { Position, Strategy } from "@/types";
import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export interface StrategyDraft {
  strategy: Strategy;
  threshold: number;
  alertThreshold: number;
  topupAmount: number;
  repayAmount: number;
}

const defaultDraft: StrategyDraft = {
  strategy: "ALERT_ONLY",
  threshold: 130,
  alertThreshold: 150,
  topupAmount: 10,
  repayAmount: 10,
};

export function useStrategyBuilder() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const [draft, setDraft] = useState<StrategyDraft>(defaultDraft);
  const [saved, setSaved] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function selectPosition(position: Position) {
    setSelectedPosition(position);
    setSaved(false);
    setDraft({
      strategy: position.strategy,
      threshold: Number(position.threshold),
      alertThreshold: Number(position.threshold) + 20,
      topupAmount: 10,
      repayAmount: 10,
    });
  }

  function updateDraft(patch: Partial<StrategyDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function saveStrategy() {
    if (!selectedPosition) return;

    const strategyUint = {
      ALERT_ONLY: 0,
      AUTO_TOPUP: 1,
      AUTO_REPAY: 2,
    }[draft.strategy];

    writeContract({
      abi: positionRegistryAbi,
      address: CONTRACT_ADDRESSES.positionRegistry,
      functionName: "updatePosition",
      args: [
        selectedPosition.id,
        selectedPosition.collateral,
        selectedPosition.debt,
        BigInt(draft.threshold),
        strategyUint,
      ],
    });
  }

  return {
    selectedPosition,
    draft,
    isPending,
    isConfirming,
    isSuccess,
    selectPosition,
    updateDraft,
    saveStrategy,
  };
}
