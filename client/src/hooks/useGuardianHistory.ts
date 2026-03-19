import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { guardianEngineAbi } from "@/lib/abis/GuardianEngine.abi";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import type { GuardianHistoryItem } from "@/types";

export function useGuardianHistory() {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["guardian-history"],
    queryFn: async (): Promise<GuardianHistoryItem[]> => {
      if (!publicClient) return [];

      const [alerts, topups, repays] = await Promise.all([
        publicClient.getLogs({
          address: CONTRACT_ADDRESSES.guardianEngine,
          event: guardianEngineAbi.find((e) => e.name === "AlertTriggered")!,
          fromBlock: "earliest",
          toBlock: "latest",
        }),
        publicClient.getLogs({
          address: CONTRACT_ADDRESSES.guardianEngine,
          event: guardianEngineAbi.find((e) => e.name === "TopUpExecuted")!,
          fromBlock: "earliest",
          toBlock: "latest",
        }),
        publicClient.getLogs({
          address: CONTRACT_ADDRESSES.guardianEngine,
          event: guardianEngineAbi.find((e) => e.name === "RepayExecuted")!,
          fromBlock: "earliest",
          toBlock: "latest",
        }),
      ]);

      const history: GuardianHistoryItem[] = [
        ...alerts.map((log) => ({
          positionId: log.args.positionId ?? 0n,
          action: "alert" as const,
          detail: `Health factor: ${log.args.healthFactor ?? 0n}`,
          txHash: log.transactionHash ?? "0x",
          timestamp: Date.now(),
          blockNumber: Number(log.blockNumber ?? 0),
        })),
        ...topups.map((log) => ({
          positionId: log.args.positionId ?? 0n,
          action: "topup" as const,
          detail: `Collateral: ${log.args.oldCollateral ?? 0n} → ${log.args.newCollateral ?? 0n}`,
          txHash: log.transactionHash ?? "0x",
          timestamp: Date.now(),
          blockNumber: Number(log.blockNumber ?? 0),
        })),
        ...repays.map((log) => ({
          positionId: log.args.positionId ?? 0n,
          action: "repay" as const,
          detail: `Debt: ${log.args.oldDebt ?? 0n} → ${log.args.newDebt ?? 0n}`,
          txHash: log.transactionHash ?? "0x",
          timestamp: Date.now(),
          blockNumber: Number(log.blockNumber ?? 0),
        })),
      ];

      return history.sort((a, b) => b.blockNumber - a.blockNumber);
    },
    refetchInterval: 10_000,
    enabled: !!publicClient,
  });
}
