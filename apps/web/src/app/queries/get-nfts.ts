import { gql } from "@apollo/client";

export const GET_NFTS = gql`
  query GetNFTs($owner: String!) {
    nfts(where: { owner: $owner }) {
      items {
        tokenId
        owner
        staked
      }
    }
    globalStaked: nfts(where: { staked: true }) {
      totalCount
    }
    userStakedCount(id: $owner) {
      stakedCount
      isPro
    }
  }
`;