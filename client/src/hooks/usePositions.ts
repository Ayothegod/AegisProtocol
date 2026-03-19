import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { positionRegistryAbi } from "@/lib/abis/PositionRegistry.abi";
import { healthCalculatorAbi } from "@/lib/abis/HealthCalculator.abi";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { getHealthStatus, strategyFromUint } from "@/lib/utils";
import type { Position } from "@/types";

export function usePositions() {
  const { address } = useAccount();

  // Step 1 — get all position IDs for connected wallet
  const { data: positionIds } = useReadContract({
    abi: positionRegistryAbi,
    address: CONTRACT_ADDRESSES.positionRegistry,
    functionName: "getOwnerPositions",
    args: [address!],
    query: { enabled: !!address },
  });

  // Step 2 — batch read all positions
  const positionCalls = (positionIds ?? []).map((id) => ({
    abi: positionRegistryAbi,
    address: CONTRACT_ADDRESSES.positionRegistry,
    functionName: "getPosition" as const,
    args: [id],
  }));

  const { data: rawPositions } = useReadContracts({
    contracts: positionCalls,
    query: { enabled: !!positionIds?.length },
  });

  // Step 3 — batch read health factors
  const healthCalls = (rawPositions ?? []).map((r) => ({
    abi: healthCalculatorAbi,
    address: CONTRACT_ADDRESSES.healthCalculator,
    functionName: "calculateHealthFactor" as const,
    args: r.result
      ? [r.result.collateral, r.result.debt, r.result.threshold]
      : [0n, 1n, 0n],
  }));

  const { data: healthFactors } = useReadContracts({
    contracts: healthCalls,
    query: { enabled: !!rawPositions?.length },
  });

  return useQuery({
    queryKey: ["positions", address, rawPositions, healthFactors],
    queryFn: (): Position[] => {
      if (!positionIds || !rawPositions || !healthFactors) return [];

      return positionIds
        .map((id, i) => {
          const raw = rawPositions[i]?.result;
          const hf = healthFactors[i]?.result ?? 0n;

          if (!raw) return null;

          return {
            id,
            owner: raw.owner,
            collateral: raw.collateral,
            debt: raw.debt,
            threshold: raw.threshold,
            strategy: strategyFromUint(raw.strategy),
            isActive: raw.isActive,
            createdAt: raw.createdAt,
            healthFactor: hf,
            status: getHealthStatus(hf),
          };
        })
        .filter(Boolean) as Position[];
    },
    enabled: !!rawPositions && !!healthFactors,
  });
}
