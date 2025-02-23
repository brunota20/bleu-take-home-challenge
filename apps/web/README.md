# BleuNFT Frontend

The BleuNFT Frontend provides a user-friendly interface for interacting with BleuNFT's ecosystem. It allows users to connect their wallets, mint and stake NFTs, view owned assets, and track on-chain events in real-time.

## Installation

Before starting, ensure you have `pnpm` installed. If you don't have it, install it globally:

```sh
npm install -g pnpm
```

Then, install the dependencies:

```sh
pnpm install
```

## Configuration

Ensure you have a `.env` file in the root directory with the required environment variables:

```env
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0xEe763b54Fb7b8De7871113Ac4654BE4AEA4681df
NEXT_PUBLIC_ENABLE_TESTNETS=true
```

## Running the Indexer

To start indexing events using Ponder, run:

```sh
pnpm run dev
```

## Testing

Run the test suite:

```bash
pnpm test
```