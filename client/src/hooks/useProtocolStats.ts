import { useQuery } from "@tanstack/react-query";
import { usePositions } from "./usePositions";
import type { ProtocolStats } from "@/types";

export function useProtocolStats() {
  const { data: positions = [] } = usePositions();

  return useQuery({
    queryKey: ["protocol-stats", positions],
    queryFn: (): ProtocolStats => {
      const atRisk = positions.filter(
        (p) => p.status === "danger" || p.status === "warn",
      ).length;

      const valueProtected = positions.reduce(
        (acc, p) => acc + p.collateral,
        0n,
      );

      return {
        totalPositions: positions.length,
        positionsSaved: 0, // will come from GuardianEngine events later
        atRisk,
        valueProtected,
      };
    },
    enabled: positions.length >= 0,
  });
}
