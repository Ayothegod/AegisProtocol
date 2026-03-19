import { usePositions } from "./usePositions";

export function useAtRiskCount(): number {
  const { data: positions = [] } = usePositions();
  return positions.filter((p) => p.status === "danger" || p.status === "warn")
    .length;
}
