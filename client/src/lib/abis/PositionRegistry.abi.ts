export const positionRegistryAbi = [
  {
    name: "registerPosition",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "collateral", type: "uint256" },
      { name: "debt", type: "uint256" },
      { name: "threshold", type: "uint256" },
      { name: "strategy", type: "uint8" },
    ],
    outputs: [{ name: "positionId", type: "uint256" }],
  },
  {
    name: "updatePosition",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "positionId", type: "uint256" },
      { name: "newCollateral", type: "uint256" },
      { name: "newDebt", type: "uint256" },
      { name: "newThreshold", type: "uint256" },
      { name: "newStrategy", type: "uint8" },
    ],
    outputs: [],
  },
  {
    name: "deletePosition",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getPosition",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "owner", type: "address" },
          { name: "collateral", type: "uint256" },
          { name: "debt", type: "uint256" },
          { name: "threshold", type: "uint256" },
          { name: "strategy", type: "uint8" },
          { name: "isActive", type: "bool" },
          { name: "createdAt", type: "uint256" },
        ],
      },
    ],
  },
  {
    name: "getOwnerPositions",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "positionCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "PositionRegistered",
    type: "event",
    inputs: [
      { name: "positionId", type: "uint256", indexed: true },
      { name: "owner", type: "address", indexed: true },
    ],
  },
  {
    name: "PositionUpdated",
    type: "event",
    inputs: [
      { name: "positionId", type: "uint256", indexed: true },
      { name: "owner", type: "address", indexed: true },
    ],
  },
  {
    name: "PositionDeleted",
    type: "event",
    inputs: [
      { name: "positionId", type: "uint256", indexed: true },
      { name: "owner", type: "address", indexed: true },
    ],
  },
] as const;
