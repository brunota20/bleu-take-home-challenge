import { gql } from "@apollo/client";

export const GET_TRANSFER_EVENTS = gql`
  query GetTransferEvents {
    transferEvents(limit: 10, where: { eventType: TRANSFER }, orderBy: "timestamp", orderDirection: "desc") {
      items {
        id
        from
        to
        tokenId
        timestamp
      }
    }
  }
`;