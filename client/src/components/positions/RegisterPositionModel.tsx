import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { positionRegistryAbi } from "@/lib/abis/PositionRegistry.abi";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import type { Strategy } from "@/types";

const strategyOptions: { label: string; value: number; key: Strategy }[] = [
  { label: "Alert Only", value: 0, key: "ALERT_ONLY" },
  { label: "Auto Top-up", value: 1, key: "AUTO_TOPUP" },
  { label: "Auto Repay", value: 2, key: "AUTO_REPAY" },
];

export function RegisterPositionModal() {
  const [open, setOpen] = useState(false);
  const [collateral, setCollateral] = useState("");
  const [debt, setDebt] = useState("");
  const [threshold, setThreshold] = useState("130");
  const [strategy, setStrategy] = useState(0);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function handleSubmit() {
    writeContract({
      abi: positionRegistryAbi,
      address: CONTRACT_ADDRESSES.positionRegistry,
      functionName: "registerPosition",
      args: [
        parseEther(collateral || "0"),
        parseEther(debt || "0"),
        BigInt(threshold),
        strategy,
      ],
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="
          px-4 py-2 text-[13px] font-semibold
          bg-accent text-[#0a0e00]
          rounded-md hover:bg-[#d4f55a]
          transition-colors cursor-pointer
        "
        >
          + Register Position
        </button>
      </DialogTrigger>

      <DialogContent className="bg-surface border border-border-hi rounded-lg p-6 max-w-md">
        <DialogHeader>
          <DialogTitle
            className="text-[22px] text-text tracking-tight"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            Register Position
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Field
            label="Collateral Amount (ETH)"
            value={collateral}
            onChange={setCollateral}
            placeholder="e.g. 2.5"
          />
          <Field
            label="Debt Amount (ETH)"
            value={debt}
            onChange={setDebt}
            placeholder="e.g. 1.2"
          />
          <Field
            label="Threshold (e.g. 130 = 1.30×)"
            value={threshold}
            onChange={setThreshold}
            placeholder="130"
          />

          <div>
            <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-2">
              Guardian Strategy
            </p>
            <div className="grid grid-cols-3 gap-2">
              {strategyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStrategy(opt.value)}
                  className={`
                    py-2 px-3 text-[12px] font-medium rounded-sm border
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
            onClick={handleSubmit}
            disabled={isPending || isConfirming}
            className="
              w-full py-2.5 mt-2
              bg-accent text-[#0a0e00]
              text-[13px] font-semibold
              rounded-md hover:bg-[#d4f55a]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors cursor-pointer
            "
          >
            {isPending
              ? "Confirming…"
              : isConfirming
                ? "Processing…"
                : isSuccess
                  ? "Registered ✓"
                  : "Register Position"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-1.5">
        {label}
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full px-3 py-2
          bg-bg border border-border rounded-sm
          font-mono text-[13px] text-text
          placeholder:text-text-3
          focus:outline-none focus:border-accent/40
          transition-colors
        "
      />
    </div>
  );
}
