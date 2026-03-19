export const CONTRACT_ADDRESSES = {
  positionRegistry: import.meta.env
    .VITE_POSITION_REGISTRY_ADDRESS as `0x${string}`,
  guardianMonitor: import.meta.env
    .VITE_GUARDIAN_MONITOR_ADDRESS as `0x${string}`,
  guardianEngine: import.meta.env.VITE_GUARDIAN_ENGINE_ADDRESS as `0x${string}`,
  healthCalculator: import.meta.env
    .VITE_HEALTH_CALCULATOR_ADDRESS as `0x${string}`,
} as const;
