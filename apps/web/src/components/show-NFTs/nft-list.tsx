'use client';

import { useState } from 'react';
import NFTHeader from './nft-header';
import { useNFTs } from '@/hooks/useNFTs';
import WalletNotConnected from '../wallet-not-connected';
import LoadingSkeleton from '../skeleton/loading-nfts';
import StakedSummary from './staked-summary';
import NFTDisplay from './nft-display';

export default function NFTList() {
  const { address, nfts, stakedCount, totalStakedCount, attestationId, isPro, loading, error, refetch } = useNFTs();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStaked, setFilterStaked] = useState<'all' | 'staked' | 'unstaked'>('all');

  if (!address) return <WalletNotConnected />;
  if (loading) return <LoadingSkeleton />;
  if (error) return <p className="text-error">Error: {error.message}</p>;

  const filteredNFTs = nfts.filter((nft) => {
    const matchesSearchTerm = nft.tokenId.toString().includes(searchTerm);
    const matchesStakedStatus =
      filterStaked === 'all' ||
      (filterStaked === 'staked' && nft.staked) ||
      (filterStaked === 'unstaked' && !nft.staked);
    return matchesSearchTerm && matchesStakedStatus;
  });

  return (
    <div className="flex-col mt-4">
      <StakedSummary totalStakedByOwner={stakedCount} totalStakedGlobally={totalStakedCount} />
      <NFTHeader
        isPro={isPro}
        attestationId={attestationId}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStaked={filterStaked}
        setFilterStaked={setFilterStaked}
      />
      <NFTDisplay filteredNFTs={filteredNFTs} onTransferSuccess={refetch} />
    </div>
  );
}
