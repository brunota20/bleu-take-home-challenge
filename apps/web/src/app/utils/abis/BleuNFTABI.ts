export const abi = [
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "safeTransferFrom",
    inputs: [
      { name: "from", type: "address", internalType: "address" },
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
      type: "function",
      name: "owner",
      inputs: [],
      outputs: [{ "name": "", "type": "address", "internalType": "address" }],
      stateMutability: "view"
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "stake",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenId", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "unstake",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenId", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "Mint",
    inputs: [
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "Staked",
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "Unstaked",
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" }
    ]
  }
] as const;
