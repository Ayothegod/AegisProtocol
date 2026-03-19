import { useBlockNumber } from "wagmi";
import { somniaTestnet } from "@/lib/somnia";

export function ChainIndicator() {
  const { data: blockNumber } = useBlockNumber({
    chainId: somniaTestnet.id,
    watch: true,
  });

  return (
    <div
      className="
      flex items-center gap-2 px-3 py-1.5
      bg-surface
      border border-border
      rounded-full
    "
    >
      <span
        className="
        w-1.25 h-1.25 rounded-full
        bg-accent
        shadow-[0_0_6px_var(--color-accent)]
        animate-pulse
      "
      />
      <span
        className="text-[12px] text-text-2 tracking-wide"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Somnia Testnet
        {blockNumber && ` · Block ${blockNumber.toLocaleString()}`}
      </span>
    </div>
  );
}
