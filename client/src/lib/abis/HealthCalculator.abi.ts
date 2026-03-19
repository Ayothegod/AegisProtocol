export const healthCalculatorAbi = [
  {
    name: "calculateHealthFactor",
    type: "function",
    stateMutability: "pure",
    inputs: [
      { name: "collateral", type: "uint256" },
      { name: "debt", type: "uint256" },
      { name: "liquidationThreshold", type: "uint256" },
    ],
    outputs: [{ name: "healthFactor", type: "uint256" }],
  },
  {
    name: "isLiquidatable",
    type: "function",
    stateMutability: "pure",
    inputs: [
      { name: "collateral", type: "uint256" },
      { name: "debt", type: "uint256" },
      { name: "threshold", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;
