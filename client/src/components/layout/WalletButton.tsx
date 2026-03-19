import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { formatAddress } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="
          flex items-center gap-2 px-3 py-1.5
          bg-surface
          border border-border
          rounded-radius-sm
          text-[12px] text-text-2
          hover:border-border-hi
          transition-colors cursor-pointer
        "
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <div
          className="
          w-4.5 h-4.5 rounded-full
          bg-linear-to-br from-accent to-[#42c8f5]
          opacity-90 shrink-0
        "
        />
        {formatAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="
        px-4 py-2
        bg-accent
        text-[#0a0e00] text-[13px] font-semibold
        rounded-radius-sm
        hover:bg-[#d4f55a]
        transition-colors cursor-pointer
      "
    >
      Connect Wallet
    </button>
  );
}
