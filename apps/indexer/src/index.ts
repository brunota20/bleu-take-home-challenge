import { ponder } from "ponder:registry";
import { transferEvents, stakingEvents } from "ponder:schema";

ponder.on("BleuNFT:Transfer", async ({ event, context }) => {
  const { db } = context;
  const { from, to, tokenId } = event.args;

  await db.insert(transferEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    from,
    to,
    tokenId: BigInt(tokenId),
    timestamp: BigInt(event.block.timestamp),
  });
});

ponder.on("BleuNFT:Mint", async ({ event, context }) => {
  const { db } = context;
  const { to, tokenId } = event.args;

  await db.insert(transferEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    from: "0x0000000000000000000000000000000000000000", // Because token is newly minted
    to,
    tokenId: BigInt(tokenId),
    timestamp: BigInt(event.block.timestamp),
  });
});

ponder.on("BleuNFT:Staked", async ({ event, context }) => {
  const { db } = context;
  const { owner, tokenId } = event.args;

  await db.insert(stakingEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    owner,
    tokenId: BigInt(tokenId),
    eventType: "Staked",
    timestamp: BigInt(event.block.timestamp),
  });
});

ponder.on("BleuNFT:Unstaked", async ({ event, context }) => {
  const { db } = context;
  const { owner, tokenId } = event.args;

  await db.insert(stakingEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    owner,
    tokenId: BigInt(tokenId),
    eventType: "Unstaked",
    timestamp: BigInt(event.block.timestamp),
  });
});
