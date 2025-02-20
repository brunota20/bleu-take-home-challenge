'use client';

import { NFT } from '@/app/utils/types';
import NFTCard from './NFTCard';


interface NFTGridProps {
  filteredNFTs: NFT[];
  onTransferSuccess: () => void;
}

export default function NFTGrid({ filteredNFTs, onTransferSuccess }: NFTGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredNFTs.map((nft) => (
        <NFTCard key={nft.tokenId} nft={nft} onTransferSuccess={onTransferSuccess} />
      ))}
    </div>
  );
}