# Bleu NFT Staking + Indexer Challenge

Welcome to the **Bleu** challenge! This monorepo contains a full-stack dapp implementation for NFT staking with event indexing.

## Project Structure

```
├── apps/
│   ├── contracts/       # Solidity smart contracts
│   ├── web/            # Next.js frontend
│   └── indexer/        # Ponder indexer
```

## Key Features

- **Smart Contract**: ERC721 NFT with staking capabilities, utilizing Ownable for access control.
- **Frontend**: Next.js app with wallet integration.
- **Indexer**: Ponder-based event indexing with a GraphQL API, including an EAS attestation to verify if a user is Pro when they have 5 or more NFTs staked.

## Getting Started

### Prerequisites

- Node.js 20.9+ (with corepack enabled)

### Quick Start

```bash
# Enable corepack (if not already enabled)
corepack enable

# Enable pnpm (one-time setup)
corepack prepare pnpm@10.2.1 --activate

# Install dependencies
pnpm install

# Start all services in development mode
pnpm dev
```

### Development Commands

```bash
# Start individual services
pnpm dev:web        # Start frontend
pnpm dev:indexer    # Start indexer
pnpm dev:anvil      # Start local blockchain

# Build
pnpm build          # Build all packages
pnpm build:web      # Build frontend only
pnpm build:indexer  # Build indexer only
pnpm build:contracts # Build contracts only

# Test
pnpm test           # Run all tests
pnpm test:web       # Run frontend tests
pnpm test:indexer   # Run indexer tests
pnpm test:contracts # Run contract tests

# Linting & Formatting
pnpm check         # Check code style and format
pnpm typecheck     # Run type checking

# Clean
pnpm clean         # Clean all build artifacts
```

### Smart Contracts

```bash
# Build contracts
pnpm contracts:build

# Run contract tests
pnpm contracts:test

# Deploy to local network
pnpm contracts:deploy

# Deploy to testnet (Sepolia)
pnpm contracts:deploy:testnet
```

See [apps/contracts/README.md](apps/contracts/README.md) for contract-specific documentation.

## Frontend

The Next.js frontend features:

- Wallet Connection: Integrated using ConnectKit.
- NFT Minting Interface: Allows the contract owner to mint NFTs.
- NFT Transfer: After minted by the owner, the NFT can be transfered for any other account.
- Staking Management: Stake and unstake NFTs directly from the UI.
- Real-Time Updates: Powered by GraphQL for live data fetching.
- NFT Filtering: Search NFTs by token ID or status (staked/unstaked).
- User Attestation Display: Shows Pro status based on EAS attestation.

See [apps/web/README.md](apps/web/README.md) for frontend-specific documentation.

## Indexer

The Ponder indexer:

- Indexes NFT transfers and staking events.
- Provides GraphQL API for querying NFT states.
- Integration with EAS to attest pro users.

See [apps/indexer/README.md](apps/indexer/README.md) for indexer-specific documentation.

## Testing & Linting

```bash
# Run all tests
pnpm test
```

## Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:web
pnpm build:indexer
pnpm build:contracts
```

## Deployment

The project can be deployed to:

- Smart Contracts: Sepolia testnet
- Frontend: Vercel
- Indexer: Your preferred hosting

```bash
# Deploy frontend to Vercel
pnpm deploy:web

# Deploy contracts to testnet
pnpm deploy:contracts

# Deploy indexer
pnpm deploy:indexer
```

See individual package READMEs for specific deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
