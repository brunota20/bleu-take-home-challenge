'use client';

import { Wallet } from 'lucide-react';

export default function WalletNotConnected() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <Wallet className="w-12 h-12 text-sub-text mb-4" />
      <h3 className="text-xl font-semibold text-sub-text mb-4">
        Please connect your wallet to see your NFTs
      </h3>
    </div>
  );
}