'use client';

import { useAccount } from 'wagmi';
import { gql, useQuery } from '@apollo/client';
import LoadingSkeleton from './skeleton/loading-nfts';
import { useState, useEffect } from 'react';
import { NFT } from '@/app/utils/types';
import WalletNotConnected from './wallet-not-connected';
import StakedSummary from './staked-summary';
import Filters from './filters';
import NFTGrid from './NFT-grid';
import Image from 'next/image';
import ProStamp from '@/public/pro.png';

const GET_NFTS = gql`
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
    userStakedCount( id: $owner ) {
      stakedCount
      isPro
    }
  }
`;

export default function NFTList() {
  const { address } = useAccount();
  const { data, loading, error, refetch } = useQuery(GET_NFTS, {
    variables: { owner: address },
    fetchPolicy: 'no-cache',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStaked, setFilterStaked] = useState<'all' | 'staked' | 'unstaked'>('all');
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [totalStakedCount, setTotalStakedCount] = useState<number>(0);
  const [stakedCount, setStakedCount] = useState<number>(0);
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setNFTs(data?.nfts?.items || []);
      setStakedCount(data?.userStakedCount?.stakedCount || 0);
      setTotalStakedCount(data?.globalStaked?.totalCount || 0);
      setIsPro(data?.userStakedCount?.isPro || false);
    }
  }, [data]);

  if (!address) {
    return <WalletNotConnected />;
  }

  if (loading) return <LoadingSkeleton />;
  if (error) return <p className="text-error">Error: {error.message}</p>;

  const filteredNFTs = nfts.filter((nft: NFT) => {
    const matchesSearchTerm = nft.tokenId.toString().includes(searchTerm);
    const matchesStakedStatus =
      filterStaked === 'all' ||
      (filterStaked === 'staked' && nft.staked) ||
      (filterStaked === 'unstaked' && !nft.staked);
    return matchesSearchTerm && matchesStakedStatus;
  });

  return (
    <div className="flex-col mt-4">
      <StakedSummary
        totalStakedByOwner={stakedCount}
        totalStakedGlobally={totalStakedCount}
      />

      <div className="flex flex-row items-center mb-6">
        {/* Pro Stamp */}
        <div className="flex-1 flex items-center justify-start">
          {isPro && (
            <Image
              src={ProStamp}
              alt="Pro Stamp"
              width={150}
              height={150}
              className="rounded-full"
              unoptimized
            />
          )}
        </div>

        {/* Centered "Your NFTs" heading */}
        <h2 className="text-2xl font-bold text-foreground text-center flex-1">
          Your NFTs
        </h2>

        {/* Filters aligned to the right */}
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