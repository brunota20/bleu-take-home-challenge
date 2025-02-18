import { onchainTable, index, onchainEnum } from "ponder";

export const eventType = onchainEnum("eventType", ["TRANSFER", "MINT"]);
export const eventTypeControl = onchainEnum("eventTypeControl", ["STAKED", "UNSTAKED"]);

export const transferEvents = onchainTable(
  "transferEvents",
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


export const stakingEvents = onchainTable(
  "stakingEvents",
  (t) => ({
    id: t.text().primaryKey(),
    owner: t.text().notNull(),
    tokenId: t.bigint().notNull(),
    eventType: eventTypeControl().notNull(),
    timestamp: t.bigint().notNull(), // Track event timestamp
  }),
  (table) => ({
    tokenIdx: index().on(table.tokenId),
  })
);


export const nfts = onchainTable(
  "nfts",
  (t) => ({
    tokenId: t.bigint().primaryKey(),
    owner: t.text().notNull(),
    staked: t.boolean().default(false),
  })
);