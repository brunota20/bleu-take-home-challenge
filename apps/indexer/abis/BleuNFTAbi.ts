export const BleuNFTAbi = [
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
