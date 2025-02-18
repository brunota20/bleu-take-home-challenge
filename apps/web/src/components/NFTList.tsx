'use client';

import { useAccount } from 'wagmi';
import { gql, useQuery } from '@apollo/client';

interface NFT {
  owner: string;
  staked: boolean;
  tokenId: string;
}

const GET_NFTS = gql`
  query GetNFTs($owner: String!) {
    nftss(where: { owner: $owner }) {
      items {
        tokenId
        owner
        staked
      }
    }
  }
`;

export default function NFTList() {
  const { address } = useAccount();
  const { data, loading, error } = useQuery(GET_NFTS, {
    variables: { owner: address },
    fetchPolicy: 'network-only',
  });

  if (loading)
    return (
      <div>
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">Your NFTs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 h-40 rounded-lg"></div>
            ))}
        </div>
      </div>
    );

  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">Your NFTs</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.nftss?.items.map((nft: NFT) => (
          <div
            key={nft.tokenId}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition"
          >
            <div className="bg-gray-100 w-full h-40 flex items-center justify-center rounded-lg">
              <span className="text-gray-400 text-lg">NFT #{nft.tokenId}</span>
            </div>
            <p className="mt-2 text-gray-700 font-semibold">
              {nft.staked ? (
                <span className="text-green-600">Staked ✅</span>
              ) : (
                <span className="text-red-500">Unstaked ❌</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
