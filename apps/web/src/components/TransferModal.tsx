'use client';

import * as React from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { abi } from '@/app/utils/abis/BleuNFTABI';
import TransactionHash from './transaction-hash';

interface NFT {
  tokenId: string;
}

interface TransferModalProps {
  nft: NFT;
  onClose: () => void;
  onTransferSuccess: () => void;
}

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function TransferModal({ nft, onClose, onTransferSuccess }: TransferModalProps) {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isTransferring, setIsTransferring] = useState(false);

  const { data: owner, isLoading, error } = useReadContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "ownerOf",
      args: [BigInt(nft.tokenId)],
    });

  const { data: receipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  useEffect(() => {
    if (receipt) {
      toast.success('NFT transferred successfully! ✅');
      setIsTransferring(false);
      onTransferSuccess();
      onClose();
    }
  }, [receipt, onClose, onTransferSuccess]);

  const handleTransfer = async () => {
    if (!recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
      toast.error('Invalid recipient address. Please enter a valid Ethereum address.');
      return;
    }

    if (!address) {
      toast.error('Wallet not connected! Please connect your wallet.');
      return;
    }

    if (!contractAddress || !contractAddress.startsWith('0x')) {
      toast.error('Contract address is invalid.');
      return;
    }

    try {
      setIsTransferring(true);
      toast.info('Processing NFT transfer...');

      const hash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: "safeTransferFrom",
        args: [owner as `0x${string}`, recipientAddress as `0x${string}`, BigInt(nft.tokenId)],
      });

      setTxHash(hash);
      toast.success('Transaction submitted! ✅');
    } catch (error: any) {
      setIsTransferring(false);
      toast.error(`Error: ${error.message || 'Something went wrong.'}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
      <div className="bg-content text-content-foreground rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Transfer NFT</h3>
        <p className="mb-2">Transferring NFT #{nft.tokenId}</p>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 bg-content text-content-foreground border-sub-text"
        />
        <div className="flex justify-end">
          <Button onClick={onClose} className="mr-2 bg-background text-foreground hover:opacity-90 transition">
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={isTransferring || isWaiting}
            className="bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
          >
            {isTransferring || isWaiting || isLoading? <Loader2 className="animate-spin w-5 h-5" /> : null}
            {isTransferring || isWaiting || isLoading? 'Transferring...' : 'Confirm Transfer'}
          </Button>
        </div>
        {txHash && <TransactionHash txHash={txHash} />}
      </div>
    </div>
  );
}