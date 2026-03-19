import { usePositions } from "@/hooks/usePositions";
import { useMemo, useState } from "react";
import type { FilterStatus, FilterStrategy, SortKey } from "./PositionFilters";
import { PositionFilters } from "./PositionFilters";
import { PositionRow } from "./PositionRow";
import { PositionRowSkeleton } from "./PositionRowSkeleton";

const TABLE_HEADERS = [
  { label: "Position", width: "w-32" },
  { label: "Collateral", width: "w-36" },
  { label: "Debt", width: "w-36" },
  { label: "Threshold", width: "w-24" },
  { label: "Health", width: "flex-1" },
  { label: "Strategy", width: "w-36" },
  { label: "Status", width: "w-24" },
  { label: "", width: "w-24" },
];

export function PositionTable() {
  const { data: positions = [], isLoading } = usePositions();

  const [status, setStatus] = useState<FilterStatus>("all");
  const [strategy, setStrategy] = useState<FilterStrategy>("all");
  const [sort, setSort] = useState<SortKey>("health_asc");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...positions];

    // search
    if (search) {
      result = result.filter((p) => p.id.toString().includes(search));
    }

    // status filter
    if (status !== "all") {
      result = result.filter((p) => p.status === status);
    }

    // strategy filter
    if (strategy !== "all") {
      result = result.filter((p) => p.strategy === strategy);
    }

    // sort
    result.sort((a, b) => {
      if (sort === "health_asc") return Number(a.healthFactor - b.healthFactor);
      if (sort === "health_desc")
        return Number(b.healthFactor - a.healthFactor);
      if (sort === "newest") return Number(b.createdAt - a.createdAt);
      if (sort === "oldest") return Number(a.createdAt - b.createdAt);
      return 0;
    });

    return result;
  }, [positions, status, strategy, sort, search]);

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      {/* filters inside panel */}
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-4 flex-wrap">
        <p className="text-[14px] font-semibold text-text">
          All Positions
          <span className="font-mono text-[12px] text-text-3 ml-2">
            {filtered.length} of {positions.length}
          </span>
        </p>
        <PositionFilters
          status={status}
          onStatus={setStatus}
          strategy={strategy}
          onStrategy={setStrategy}
          sort={sort}
          onSort={setSort}
          search={search}
          onSearch={setSearch}
        />
      </div>

      {/* table header */}
      <div
        className="
        flex items-center gap-4
        px-5 py-2.5
        border-b border-border
        bg-raised
      "
      >
        {TABLE_HEADERS.map((h) => (
          <p
            key={h.label}
            className={`
              font-mono text-[10px] text-text-3
              tracking-wider uppercase
              ${h.width}
            `}
          >
            {h.label}
          </p>
        ))}
      </div>

      {/* rows */}
      <div className="divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <PositionRowSkeleton key={i} />
          ))
        ) : filtered.length === 0 ? (
          <EmptyTable />
        ) : (
          filtered.map((p) => (
            <PositionRow key={p.id.toString()} position={p} />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyTable() {
  return (
    <div className="py-16 text-center">
      <p className="text-[13px] text-text-3">No positions match your filters</p>
      <p className="font-mono text-[11px] text-text-3 mt-1">
        Try adjusting the filters above
      </p>
    </div>
  );
}
