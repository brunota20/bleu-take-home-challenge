import { ponder } from "ponder:registry";
import { transferEvent, stakingEvent, nft, userStakedCount } from "ponder:schema";
import { createAttestation } from "./eas/attestations/createAttestation";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const easContractAddress = process.env.EAS_CONTRACT_ADDRESS || "";
const eas = new EAS(easContractAddress);

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
eas.connect(signer);

ponder.on("BleuNFT:Transfer", async ({ event, context }) => {
  const { db } = context;
  const { from, to, tokenId } = event.args;

  // Insert transfer event
  await db.insert(transferEvent).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    from,
    to,
    tokenId: BigInt(tokenId),
    eventType: "TRANSFER",
    timestamp: BigInt(event.block.timestamp),
  });

  const nftRecord = await db.find(nft, { tokenId: BigInt(tokenId) });

  if (nftRecord && nftRecord.staked) {
    const oldOwnerRecord = await db.find(userStakedCount, { id: from });

    if (oldOwnerRecord) {
      await db.update(userStakedCount, { id: from }).set((row) => ({
        stakedCount: Math.max(0, row.stakedCount - 1),
        isPro: row.stakedCount - 1 >= 5,
      }));
    }
  }

  // Upsert NFT owner in `nfts` table
  await db.insert(nft)
    .values({
      tokenId: BigInt(tokenId),
      owner: to,
      staked: false,
    })
    .onConflictDoUpdate(() => ({
      owner: to,
      staked: false,
    }));
});

ponder.on("BleuNFT:Mint", async ({ event, context }) => {
  const { db } = context;
  const { to, tokenId } = event.args;

  // Insert mint event
  await db.insert(transferEvent).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    from: "0x0000000000000000000000000000000000000000",
    to,
    tokenId: BigInt(tokenId),
    eventType: "MINT",
    timestamp: BigInt(event.block.timestamp),
  });

  // Upsert NFT into `nfts` table
  await db.insert(nft)
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
  await db.insert(stakingEvent).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    owner,
    tokenId: BigInt(tokenId),
    eventType: "STAKED",
    timestamp: BigInt(event.block.timestamp),
  });

  // Upsert NFT staking status
  await db.insert(nft)
    .values({ tokenId: BigInt(tokenId), owner, staked: true })
    .onConflictDoUpdate((row) => ({ staked: true }));

  const userRecord = await db.find(userStakedCount, { id: owner });
  const newStakedCount = (userRecord?.stakedCount || 0) + 1;
  const isPro = newStakedCount >= 5;
  let attestationUID = userRecord?.attestationUID;

  if (isPro && !attestationUID) {
    attestationUID = await createAttestation(owner, `pro-user-${owner}`, newStakedCount, isPro);
  }

  await db.insert(userStakedCount)
    .values({ id: owner, stakedCount: newStakedCount, isPro, attestationUID })
    .onConflictDoUpdate((row) => ({ stakedCount: newStakedCount, isPro, attestationUID }));
});

ponder.on("BleuNFT:Unstaked", async ({ event, context }) => {
  const { db } = context;
  const { owner, tokenId } = event.args;

  // Insert unstaking event
  await db.insert(stakingEvent).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    owner,
    tokenId: BigInt(tokenId),
    eventType: "UNSTAKED",
    timestamp: BigInt(event.block.timestamp),
  });

  // Upsert NFT staking status
  await db.insert(nft)
    .values({ tokenId: BigInt(tokenId), owner, staked: false })
    .onConflictDoUpdate((row) => ({ staked: false }));

  const userRecord = await db.find(userStakedCount, { id: owner });
  if (userRecord) {
    const newStakedCount = Math.max(0, userRecord.stakedCount - 1);
    const isPro = newStakedCount >= 5;
    let attestationUID = userRecord.attestationUID;

    // Revoke attestation if user falls below Pro threshold
    if (!isPro && attestationUID) {
      try {
        const revokeTx = await eas.revoke({
          schema: "0xf6c07878be56af4169772818e1fb73d5c13c7afa436549c6d4e199bc560732e0",
          data: { uid: attestationUID },
        });
        await revokeTx.wait();
        attestationUID = null;
      } catch (error) {
        console.error(`Error revoking attestation for user ${owner}:`, error);
      }
    }

    await db.update(userStakedCount, { id: owner }).set({
      stakedCount: newStakedCount,
      isPro,
      attestationUID,
    });
  }
});
