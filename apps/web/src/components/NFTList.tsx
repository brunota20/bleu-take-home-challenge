'use client';

import { useAccount } from 'wagmi';
import { gql, useQuery } from '@apollo/client';
import LoadingSkeleton from './skeleton/loading-nfts';
import { useState } from 'react';
import { NFT } from '@/app/utils/types';
import WalletNotConnected from './wallet-not-connected';
import StakedSummary from './staked-summary';
import Filters from './filters';
import NFTGrid from './NFT-grid';


const GET_NFTS = gql`
  query GetNFTs($owner: String!) {
    nfts: nftss(where: { owner: $owner }) {
      items {
        tokenId
        owner
        staked
      }
    }
    ownerStaker: nftss(where: { owner: $owner, staked: true }) {
      totalCount
    }
    globalStaked: nftss(where: { staked: true }) {
      totalCount
    }
  }
`;

export default function NFTList() {
  const { address } = useAccount();
  const { data, loading, error, refetch } = useQuery(GET_NFTS, {
    variables: { owner: address },
    fetchPolicy: 'network-only',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStaked, setFilterStaked] = useState<'all' | 'staked' | 'unstaked'>('all');

  if (!address) {
    return <WalletNotConnected />;
  }

  if (loading) return <LoadingSkeleton />;
  if (error) return <p className="text-error">Error: {error.message}</p>;

  const nfts = data?.nfts?.items || [];
  const totalStakedByOwner = data?.ownerStaker?.totalCount || 0;
  const totalStakedGlobally = data?.globalStaked?.totalCount || 0;

  const filteredNFTs = nfts.filter((nft: NFT) => {
    const matchesSearchTerm = nft.tokenId.includes(searchTerm);
    const matchesStakedStatus =
      filterStaked === 'all' ||
      (filterStaked === 'staked' && nft.staked) ||
      (filterStaked === 'unstaked' && !nft.staked);
    return matchesSearchTerm && matchesStakedStatus;
  });

  return (
    <div className="flex-col mt-4">
      <StakedSummary
        totalStakedByOwner={totalStakedByOwner}
        totalStakedGlobally={totalStakedGlobally}
      />

      <div className="flex flex-row items-center">
        <div className="flex-1"></div>
        
        <h2 className="text-2xl font-bold text-foreground text-center flex-1">
          Your NFTs
        </h2>
        <div className="flex-1 flex justify-end">
          <Filters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStaked={filterStaked}
            setFilterStaked={setFilterStaked}
          />
        </div>
      </div>

      {filteredNFTs.length === 0 ? (
        <p className="text-center text-sub-text">No NFTs match your filters 🎨</p>
      ) : (
        <NFTGrid filteredNFTs={filteredNFTs} onTransferSuccess={refetch} />
      )}
    </div>
  );
}