import { WalletButton } from "./WalletButton";
import { LogoMark } from "./LogoMark";
import { ChainIndicator } from "./ChainIndicator";
import { GuardianStatus } from "./GuardianStatus";

export function Topbar() {
  return (
    <header
      className="
      sticky top-0 z-50
      flex items-center justify-between h-15 px-5
      border-b border-border bg-[rgba(7,9,11,0.85)] backdrop-blur-xl
    "
    >
      <LogoMark />
      <ChainIndicator />
      <div className="flex items-center gap-2">
        <GuardianStatus />
        <WalletButton />
      </div>
    </header>
  );
}
