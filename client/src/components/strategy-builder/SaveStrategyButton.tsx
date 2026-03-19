interface SaveStrategyButtonProps {
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  onSave: () => void;
}

export function SaveStrategyButton({
  isPending,
  isConfirming,
  isSuccess,
  onSave,
}: SaveStrategyButtonProps) {
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={onSave}
        disabled={isPending || isConfirming}
        className="
          w-full py-3
          bg-accent text-[#0a0e00]
          text-[14px] font-semibold rounded-md
          hover:bg-[#d4f55a]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors cursor-pointer
        "
      >
        {isPending
          ? "Confirming…"
          : isConfirming
            ? "Saving…"
            : isSuccess
              ? "✓ Strategy Saved"
              : "Save Strategy"}
      </button>

      {isSuccess && (
        <p className="font-mono text-[11px] text-accent text-center">
          Guardian updated — Somnia reactivity will enforce your new strategy on
          the next block
        </p>
      )}
    </div>
  );
}
