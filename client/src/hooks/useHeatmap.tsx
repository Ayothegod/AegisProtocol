import { useState, useMemo } from "react";
import { usePositions } from "./usePositions";
import type { Position, HealthStatus } from "@/types";

export type HeatmapSort = "health_asc" | "health_desc" | "newest" | "oldest";
export type HeatmapFilter = HealthStatus | "all";

export function useHeatmap() {
  const { data: positions = [], isLoading } = usePositions();
  const [filter, setFilter] = useState<HeatmapFilter>("all");
  const [sort, setSort] = useState<HeatmapSort>("health_asc");
  const [selected, setSelected] = useState<Position | null>(null);

  const filtered = useMemo(() => {
    let result = [...positions];

    if (filter !== "all") {
      result = result.filter((p) => p.status === filter);
    }

    result.sort((a, b) => {
      if (sort === "health_asc") return Number(a.healthFactor - b.healthFactor);
      if (sort === "health_desc")
        return Number(b.healthFactor - a.healthFactor);
      if (sort === "newest") return Number(b.createdAt - a.createdAt);
      if (sort === "oldest") return Number(a.createdAt - b.createdAt);
      return 0;
    });

    return result;
  }, [positions, filter, sort]);

  return {
    positions,
    filtered,
    isLoading,
    filter,
    setFilter,
    sort,
    setSort,
    selected,
    setSelected,
  };
}
