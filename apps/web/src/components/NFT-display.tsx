import NFTGrid from './NFT-grid';
import { NFT } from '@/app/utils/types';

interface NFTDisplayProps {
  filteredNFTs: NFT[];
  onTransferSuccess: () => void;
}

export default function NFTDisplay({ filteredNFTs, onTransferSuccess }: NFTDisplayProps) {
  return filteredNFTs.length === 0 ? (
    <p className="text-center text-sub-text">No NFTs match your filters 🎨</p>
  ) : (
    <NFTGrid filteredNFTs={filteredNFTs} onTransferSuccess={onTransferSuccess} />
  );
}
