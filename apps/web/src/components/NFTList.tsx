'use client';

import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { NFT } from '@/app/utils/types';
import WalletNotConnected from './wallet-not-connected';
import LoadingSkeleton from './skeleton/loading-nfts';
import StakedSummary from './staked-summary';
import NFTHeader from './NFTHeader';
import NFTDisplay from './NFT-display';
import { GET_NFTS } from '@/app/queries/get-nfts';

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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStaked={filterStaked}
        setFilterStaked={setFilterStaked}
      />
      <NFTDisplay filteredNFTs={filteredNFTs} onTransferSuccess={refetch} />
    </div>
  );
}