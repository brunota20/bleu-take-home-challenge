import { onchainTable, index, onchainEnum } from "ponder";

export const eventType = onchainEnum("eventType", ["staked", "unstaked"]);

export const transferEvents = onchainTable(
  "transferEvents",
  (t) => ({
    id: t.text().primaryKey(),
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
    eventType: eventType().notNull(),
    timestamp: t.bigint().notNull(), // Track event timestamp
  }),
  (table) => ({
    tokenIdx: index().on(table.tokenId),
  })
);
