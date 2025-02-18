import { ponder } from "ponder:registry";
import { transferEvents, stakingEvents, nfts } from "ponder:schema";

ponder.on("BleuNFT:Transfer", async ({ event, context }) => {
  const { db } = context;
  const { from, to, tokenId } = event.args;

  // Insert transfer event
  await db.insert(transferEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    from,
    to,
    tokenId: BigInt(tokenId),
    eventType: "TRANSFER",
    timestamp: BigInt(event.block.timestamp),
  });

  // Upsert NFT owner in `nfts` table
  await db.insert(nfts)
    .values({
      tokenId: BigInt(tokenId),
      owner: to,
      staked: false, // Transfer should reset staking status
    })
    .onConflictDoUpdate(() => ({
      owner: to,
      staked: false, // Reset staking if transferred
    }));
});

ponder.on("BleuNFT:Mint", async ({ event, context }) => {
  const { db } = context;
  const { to, tokenId } = event.args;

  // Insert mint event
  await db.insert(transferEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    from: "0x0000000000000000000000000000000000000000",
    to,
    tokenId: BigInt(tokenId),
    eventType: "MINT",
    timestamp: BigInt(event.block.timestamp),
  });

  // Upsert NFT into `nfts` table
  await db.insert(nfts)
    .values({
      tokenId: BigInt(tokenId),
      owner: to,
      staked: false,
    })
    .onConflictDoNothing(); // Prevent re-inserting the same NFT
});

ponder.on("BleuNFT:Staked", async ({ event, context }) => {
  const { db } = context;
  const { owner, tokenId } = event.args;

  // Insert staking event
  await db.insert(stakingEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    owner,
    tokenId: BigInt(tokenId),
    eventType: "STAKED",
    timestamp: BigInt(event.block.timestamp),
  });

  // Upsert NFT staking status
  await db.insert(nfts)
    .values({
      tokenId: BigInt(tokenId),
      owner,
      staked: true,
    })
    .onConflictDoUpdate(() => ({
      staked: true,
    }));
});

ponder.on("BleuNFT:Unstaked", async ({ event, context }) => {
  const { db } = context;
  const { owner, tokenId } = event.args;

  // Insert unstaking event
  await db.insert(stakingEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    owner,
    tokenId: BigInt(tokenId),
    eventType: "UNSTAKED",
    timestamp: BigInt(event.block.timestamp),
  });

  // Upsert NFT staking status
  await db.insert(nfts)
    .values({
      tokenId: BigInt(tokenId),
      owner,
      staked: false,
    })
    .onConflictDoUpdate(() => ({
      staked: false,
    }));
});
