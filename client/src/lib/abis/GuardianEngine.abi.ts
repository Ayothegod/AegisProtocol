export const guardianEngineAbi = [
  {
    name: "AlertTriggered",
    type: "event",
    inputs: [
      { name: "positionId", type: "uint256", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "healthFactor", type: "uint256", indexed: false },
    ],
  },
  {
    name: "TopUpExecuted",
    type: "event",
    inputs: [
      { name: "positionId", type: "uint256", indexed: true },
      { name: "oldCollateral", type: "uint256", indexed: false },
      { name: "newCollateral", type: "uint256", indexed: false },
    ],
  },
  {
    name: "RepayExecuted",
    type: "event",
    inputs: [
      { name: "positionId", type: "uint256", indexed: true },
      { name: "oldDebt", type: "uint256", indexed: false },
      { name: "newDebt", type: "uint256", indexed: false },
    ],
  },
] as const;
