import { cn } from "@/lib/utils";
import { useAccount, useBalance } from "wagmi";
import { somniaTestnet } from "@/lib/somnia";
import { formatEther } from "viem";

const MIN_BALANCE = 32;

export function SomBalance() {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: somniaTestnet.id,
  });

  const value = balance ? parseFloat(formatEther(balance.value)) : 0;
  const pct = Math.min((value / 300) * 100, 100);
  const isBelowMin = value < MIN_BALANCE;

  return (
    <div
      className="
      p-3
      bg-raised border border-border rounded-md
    "
    >
      <p
        className="
        text-[11px] font-semibold tracking-widest uppercase
        text-text-3 mb-1
      "
      >
        SOM Balance
      </p>
      <p
        className="text-[24px] leading-none text-accent"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value.toFixed(1)}
      </p>

      <div className="h-0.5 bg-border rounded-full mt-2 mb-1.5 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 6px rgba(200,245,66,0.5)",
          }}
        />
      </div>

      <p
        className={cn(
          "text-[11px]",
          isBelowMin ? "text-danger" : "text-text-3",
        )}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {isBelowMin ? "⚠ below 32 SOM min" : "min. 32 SOM required"}
      </p>
    </div>
  );
}
