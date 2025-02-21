import { gql } from "@apollo/client";

export const GET_MINT_EVENTS = gql`
  query GetMintEvents {
    transferEvents(limit: 10, where: { eventType: MINT }, orderBy: "timestamp", orderDirection: "desc") {
      items {
        id
        to
        tokenId
        timestamp
      }
    }
  }
`;