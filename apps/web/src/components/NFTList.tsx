'use client';

import { useAccount } from 'wagmi';
import { gql, useQuery } from '@apollo/client';
import LoadingSkeleton from './skeleton/loading-nfts';
import NFTCard from './NFTCard';
import { Wallet } from 'lucide-react';
import { useState } from 'react';

interface NFT {
  owner: string;
  staked: boolean;
  tokenId: string;
}

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Wallet className="w-12 h-12 text-sub-text mb-4" />
        <h3 className="text-xl font-semibold text-sub-text mb-4">
          Please connect your wallet to see your NFTs
        </h3>
      </div>
    );
  }

  if (loading) return <LoadingSkeleton />;
  if (error) return <p className="text-error">Error: {error.message}</p>;

  const nfts = data?.nfts?.items || [];
  const totalStakedByOwner = data?.ownerStaker?.totalCount;
  const totalStakedGlobally = data?.globalStaked?.totalCount;

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
      <h2 className="text-2xl text-center font-bold text-foreground mb-4">Your NFTs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-[rgb(var(--content))] border border-[rgb(var(--sub-text))]">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
            Your Staked NFTs
          </h3>
          <p className="text-[rgb(var(--sub-text))]">{totalStakedByOwner}</p>
        </div>
        <div className="p-4 rounded-lg bg-[rgb(var(--content))] border border-[rgb(var(--sub-text))]">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
            Global Staked NFTs
          </h3>
          <p className="text-[rgb(var(--sub-text))]">{totalStakedGlobally}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Token ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-lg bg-[rgb(var(--content))] text-[rgb(var(--content-foreground))] border-[rgb(var(--sub-text))]"
        />
        <select
          value={filterStaked}
          onChange={(e) => setFilterStaked(e.target.value as 'all' | 'staked' | 'unstaked')}
          className="p-2 border rounded-lg bg-[rgb(var(--content))] text-[rgb(var(--content-foreground))] border-[rgb(var(--sub-text))]"
        >
          <option value="all">All</option>
          <option value="staked">Staked</option>
          <option value="unstaked">Unstaked</option>
        </select>
      </div>

      {/* NFT List */}
      {filteredNFTs.length === 0 ? (
        <p className="text-center text-sub-text">No NFTs match your filters 🎨</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNFTs.map((nft: NFT) => (
            <NFTCard key={nft.tokenId} nft={nft} onTransferSuccess={refetch} />
          ))}
        </div>
      )}
    </div>
  );
}