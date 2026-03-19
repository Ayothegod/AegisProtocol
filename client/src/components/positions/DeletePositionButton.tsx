import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { positionRegistryAbi } from "@/lib/abis/PositionRegistry.abi";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

interface DeletePositionButtonProps {
  positionId: bigint;
  onSuccess: () => void;
}

export function DeletePositionButton({
  positionId,
  onSuccess,
}: DeletePositionButtonProps) {
  const [confirming, setConfirming] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    writeContract({
      abi: positionRegistryAbi,
      address: CONTRACT_ADDRESSES.positionRegistry,
      functionName: "deletePosition",
      args: [positionId],
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {confirming && (
        <p className="font-mono text-[11px] text-danger">
          This will stop Guardian monitoring this position. Are you sure?
        </p>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending || isWaiting}
        className="
          w-full py-2.5
          bg-danger/10 border border-danger/30
          text-danger text-[13px] font-semibold rounded-md
          hover:bg-danger/20
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors cursor-pointer
        "
      >
        {isPending
          ? "Confirming…"
          : isWaiting
            ? "Processing…"
            : isSuccess
              ? "Deleted ✓"
              : confirming
                ? "Confirm Delete"
                : "Delete Position"}
      </button>

      {confirming && !isPending && !isWaiting && (
        <button
          onClick={() => setConfirming(false)}
          className="
            w-full py-2 text-[12px] text-text-3
            hover:text-text-2 transition-colors cursor-pointer
          "
        >
          Cancel
        </button>
      )}
    </div>
  );
}
