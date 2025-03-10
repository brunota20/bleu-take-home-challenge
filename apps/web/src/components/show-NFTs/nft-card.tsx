'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import TransferModal from './transfer-modal';

interface NFT {
  owner: string;
  staked: boolean;
  tokenId: string;
}

interface NFTCardProps {
  nft: NFT;
  onTransferSuccess: () => void;
}

export default function NFTCard({ nft, onTransferSuccess }: NFTCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTransferSuccess = () => {
    setIsModalOpen(false);
    onTransferSuccess();
  };

  return (
    <div data-testid='nft-card' className="shadow-lg rounded-xl p-4 flex flex-col items-center border hover:shadow-2xl transition bg-content border-sub-text">
      <div className="w-full h-40 flex items-center justify-center rounded-lg bg-background">
        <span className="text-lg text-sub-text">NFT #{nft.tokenId}</span>
      </div>
      <p className="mt-2 font-semibold">
        {nft.staked ? (
          <span className="text-success">Staked ✅</span>
        ) : (
          <span className="text-error">Unstaked ❌</span>
        )}
      </p>
      {!nft.staked && <Button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Transfer
      </Button>}
      {isModalOpen && (
        <TransferModal nft={nft} onClose={() => setIsModalOpen(false)} onTransferSuccess={handleTransferSuccess} />
      )}
    </div>
  );
}
