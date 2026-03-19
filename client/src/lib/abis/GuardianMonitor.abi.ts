export const guardianMonitorAbi = [
  {
    name: "GuardianTriggered",
    type: "event",
    inputs: [
      { name: "positionId", type: "uint256", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "healthFactor", type: "uint256", indexed: false },
    ],
  },
  {
    name: "HealthStatusUpdated",
    type: "event",
    inputs: [
      { name: "positionId", type: "uint256", indexed: true },
      { name: "newHealthFactor", type: "uint256", indexed: false },
    ],
  },
] as const;
