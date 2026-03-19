import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HealthStatus, Strategy } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHealthFactor(hf: bigint): string {
  return (Number(hf) / 1e18).toFixed(2) + "×";
}

export function formatUSD(value: bigint): string {
  const num = Number(value) / 1e18;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function getHealthStatus(hf: bigint): HealthStatus {
  const value = Number(hf) / 1e18;
  if (value < 1.2) return "danger";
  if (value < 1.5) return "warn";
  return "safe";
}

export function getHealthBarWidth(hf: bigint): number {
  const value = Number(hf) / 1e18;
  return Math.min((value / 4) * 100, 100);
}

export function strategyLabel(strategy: Strategy): string {
  const map: Record<Strategy, string> = {
    ALERT_ONLY: "Alert Only",
    AUTO_TOPUP: "Auto Top-up",
    AUTO_REPAY: "Auto Repay",
  };
  return map[strategy];
}

export function strategyFromUint(value: number): Strategy {
  const map: Record<number, Strategy> = {
    0: "ALERT_ONLY",
    1: "AUTO_TOPUP",
    2: "AUTO_REPAY",
  };
  return map[value] ?? "ALERT_ONLY";
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  return `${Math.floor(diff / 3_600_000)}h`;
}
