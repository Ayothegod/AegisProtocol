import { guardianEngineAbi } from "@/lib/abis/GuardianEngine.abi";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

export interface LeaderboardEntry {
  positionId: bigint;
  owner: `0x${string}`;
  totalSaves: number;
  totalTopups: number;
  totalRepays: number;
  totalAlerts: number;
  valueProtected: bigint;
  rank: number;
}

export function useLeaderboard() {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
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

      // aggregate by positionId
      const map: Record<string, Omit<LeaderboardEntry, "rank">> = {};

      function ensure(positionId: bigint, owner: `0x${string}`) {
        const key = positionId.toString();
        if (!map[key]) {
          map[key] = {
            positionId,
            owner,
            totalSaves: 0,
            totalTopups: 0,
            totalRepays: 0,
            totalAlerts: 0,
            valueProtected: 0n,
          };
        }
        return map[key];
      }

      alerts.forEach((log) => {
        const entry = ensure(
          log.args.positionId ?? 0n,
          log.args.owner ?? "0x0",
        );
        entry.totalAlerts++;
        entry.totalSaves++;
      });

      topups.forEach((log) => {
        const entry = ensure(log.args.positionId ?? 0n, "0x0");
        entry.totalTopups++;
        entry.totalSaves++;
        entry.valueProtected += log.args.newCollateral ?? 0n;
      });

      repays.forEach((log) => {
        const entry = ensure(log.args.positionId ?? 0n, "0x0");
        entry.totalRepays++;
        entry.totalSaves++;
      });

      // sort by totalSaves desc then assign rank
      return Object.values(map)
        .sort((a, b) => b.totalSaves - a.totalSaves)
        .map((entry, i) => ({ ...entry, rank: i + 1 }));
    },
    enabled: !!publicClient,
    refetchInterval: 15_000,
  });
}
