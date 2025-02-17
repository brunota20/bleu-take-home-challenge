import { onchainTable, index } from "ponder";

export const transferEvents = onchainTable(
  "transferEvents",
  (t) => ({
    id: t.text().primaryKey(),  // Change from uuid() to text()
    from: t.text().notNull(),
    to: t.text().notNull(),
    tokenId: t.bigint().notNull(),
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
    eventType: t.text().notNull(), // "staked" or "unstaked"
    timestamp: t.bigint().notNull(), // Track event timestamp
  }),
  (table) => ({
    tokenIdx: index().on(table.tokenId),
  })
);
