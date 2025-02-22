import { onchainTable, index, onchainEnum } from "ponder";

export const eventType = onchainEnum("eventType", ["TRANSFER", "MINT"]);
export const eventTypeControl = onchainEnum("eventTypeControl", ["STAKED", "UNSTAKED"]);

export const transferEvent = onchainTable(
  "transferEvent",
  (t) => ({
    id: t.text().primaryKey(),
    from: t.text().notNull(),
    to: t.text().notNull(),
    tokenId: t.bigint().notNull(),
    eventType: eventType().notNull(),
    timestamp: t.bigint().notNull(),
  }),
  (table) => ({
    tokenIdx: index().on(table.tokenId),
    toIdx: index().on(table.to),
  })
);


export const stakingEvent = onchainTable(
  "stakingEvent",
  (t) => ({
    id: t.text().primaryKey(),
    owner: t.text().notNull(),
    tokenId: t.bigint().notNull(),
    eventType: eventTypeControl().notNull(),
    timestamp: t.bigint().notNull(),
  }),
  (table) => ({
    tokenIdx: index().on(table.tokenId),
    ownerIdx: index().on(table.owner),
  })
);


export const nft = onchainTable(
  "nft",
  (t) => ({
    tokenId: t.bigint().primaryKey(),
    owner: t.text().notNull(),
    staked: t.boolean().default(false),
  })
);


export const userStakedCount = onchainTable(
  "userStakedCount",
  (t) => ({
    id: t.text().primaryKey(),
    stakedCount: t.integer().notNull().default(0),
    isPro: t.boolean().default(false),
    attestationUID: t.text(),
  }),
  (table) => ({
    userIdx: index().on(table.id),
  })
);
