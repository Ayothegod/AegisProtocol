import { positionRegistryAbi } from "@/lib/abis/PositionRegistry.abi";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import type { Position, Strategy } from "@/types";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface UpdatePositionFormProps {
  position: Position;
  onSuccess: () => void;
}

const strategyOptions: { label: string; value: number; key: Strategy }[] = [
  { label: "Alert Only", value: 0, key: "ALERT_ONLY" },
  { label: "Auto Top-up", value: 1, key: "AUTO_TOPUP" },
  { label: "Auto Repay", value: 2, key: "AUTO_REPAY" },
];

export function UpdatePositionForm({
  position,
  onSuccess,
}: UpdatePositionFormProps) {
  const [collateral, setCollateral] = useState(
    formatEther(position.collateral),
  );
  const [debt, setDebt] = useState(formatEther(position.debt));
  const [threshold, setThreshold] = useState(position.threshold.toString());
  const [strategy, setStrategy] = useState(
    strategyOptions.findIndex((s) => s.key === position.strategy),
  );

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function handleUpdate() {
    writeContract({
      abi: positionRegistryAbi,
      address: CONTRACT_ADDRESSES.positionRegistry,
      functionName: "updatePosition",
      args: [
        position.id,
        parseEther(collateral),
        parseEther(debt),
        BigInt(threshold),
        strategy,
      ],
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase">
        Update Position
      </p>

      <Field
        label="Collateral (ETH)"
        value={collateral}
        onChange={setCollateral}
      />
      <Field label="Debt (ETH)" value={debt} onChange={setDebt} />
      <Field label="Threshold" value={threshold} onChange={setThreshold} />

      {/* strategy picker */}
      <div>
        <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-2">
          Strategy
        </p>
        <div className="grid grid-cols-3 gap-2">
          {strategyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStrategy(opt.value)}
              className={`
                py-2 px-2 text-[11px] font-medium rounded-sm border
                transition-colors cursor-pointer
                ${
                  strategy === opt.value
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-bg border-border text-text-2 hover:border-border-hi"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleUpdate}
        disabled={isPending || isConfirming}
        className="
          w-full py-2.5
          bg-accent text-[#0a0e00]
          text-[13px] font-semibold rounded-md
          hover:bg-[#d4f55a]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors cursor-pointer
        "
      >
        {isPending
          ? "Confirming…"
          : isConfirming
            ? "Processing…"
            : isSuccess
              ? "Updated ✓"
              : "Save Changes"}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-1.5">
        {label}
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-3 py-2
          bg-bg border border-border rounded-sm
          font-mono text-[13px] text-text
          focus:outline-none focus:border-accent/40
          transition-colors
        "
      />
    </div>
  );
}
