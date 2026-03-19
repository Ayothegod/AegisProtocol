export type Strategy = "ALERT_ONLY" | "AUTO_TOPUP" | "AUTO_REPAY";
export type HealthStatus = "safe" | "warn" | "danger";

export interface Position {
  id: bigint;
  owner: `0x${string}`;
  collateral: bigint;
  debt: bigint;
  threshold: bigint;
  strategy: Strategy;
  isActive: boolean;
  createdAt: bigint;
  healthFactor: bigint;
  status: HealthStatus;
}

export interface AlertEvent {
  id: string;
  type:
    | "guardian_fired"
    | "topup_executed"
    | "repay_executed"
    | "threshold_breach"
    | "registered";
  positionId: bigint;
  message: string;
  detail: string;
  timestamp: number;
  status: HealthStatus | "neutral";
}

export interface ProtocolStats {
  totalPositions: number;
  positionsSaved: number;
  atRisk: number;
  valueProtected: bigint;
}

export interface GuardianHistoryItem {
  positionId: bigint;
  action: "alert" | "topup" | "repay";
  detail: string;
  txHash: string;
  timestamp: number;
  blockNumber: number;
}
