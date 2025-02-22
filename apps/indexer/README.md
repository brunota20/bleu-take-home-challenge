# BleuNFT Ponder Indexing & Attestation

This subproject is responsible for indexing on-chain events related to BleuNFT using Ponder and managing user attestations with Ethereum Attestation Service (EAS). The system listens for NFT transfers, mints, staking, and unstaking events, storing the latest ownership and staking status in a database while attesting Pro users.

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

Ensure you have a `.env.local` file in the root directory with the required environment variables:

```env
ETH_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
CONTRACT_ADDRESS=0xEe763b54Fb7b8De7871113Ac4654BE4AEA4681df
PRIVATE_KEY=your-private-key-here
SCHEMA_REGISTRY_CONTRACT_ADDRESS=0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0
EAS_CONTRACT_ADDRESS=0xC2679fBD37d54388Ce493F1DB75320D236e1815e
SCHEMA_UID=0xf6c07878be56af4169772818e1fb73d5c13c7afa436549c6d4e199bc560732e0
```

## Running the Indexer

To start indexing events using Ponder, run:

```sh
pnpm run dev
```

This will listen for `Transfer`, `Mint`, `Staked`, and `Unstaked` events and update the database accordingly.

## Attestation System (EAS)

This subproject utilizes Ethereum Attestation Service (EAS) to manage Pro user attestations:

- Users who stake **5 or more NFTs** are considered **Pro** and receive an attestation.
- If a Pro user unstakes NFTs and drops below 5 staked, their attestation is revoked.

### Creating an Attestation

Attestations are automatically created when a user stakes their 5th NFT. However, you can manually create an attestation by calling the function:

```ts
import { createAttestation } from "./eas/attestations/createAttestation";

const attestationUID = await createAttestation(
  "0xUserAddress",
  "pro-user-0xUserAddress",
  5,
  true
);
```

### Revoking an Attestation

If a user unstakes NFTs and their total drops below 5, their attestation is revoked automatically. However, you can manually revoke an attestation using:

```ts
eas.revoke({
  schema: SCHEMA_UID,
  data: { uid: "attestation-uid-here" },
});
```

## Schema Registration

To register a new schema for EAS, firstly go to src/eas/attestations with:

```bash
cd src/eas/attestations
```

and run:

```bash
node deployAttestationSchema.ts
```

This will create a schema with the following structure:

```ts
uint256 stakedCount, bool isPro;
```

## Summary

- **Install dependencies:** `pnpm install`
- **Start indexing events:** `pnpm run dev`
- **Register a new schema (if needed):** `pnpm run register-schema`
- **Attest Pro users when they stake 5+ NFTs**
- **Revoke attestation when user drops below 5 staked NFTs**

This system ensures that NFT ownership and staking status remain up to date and Pro users receive attestations accordingly.

