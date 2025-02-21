'use client';

import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@/components/ui/button';
import { abi } from '@/app/utils/abis/BleuNFTABI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import TransactionHash from './transaction-hash';
import { setGlobalProcessing } from '@/hooks/useMintStakeStatus';
import { Input } from './ui/text-input';
import { handleTransactionError } from '../app/utils/handle-transaction-error';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function MintStakeControls() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const mintFormRef = useRef<HTMLFormElement>(null);
  const stakeFormRef = useRef<HTMLFormElement>(null);
  const unstakeFormRef = useRef<HTMLFormElement>(null);

  const { data: receipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  useEffect(() => {
    if (receipt) {
      toast.success('Transaction confirmed! ✅');
      setIsLoading(false);
      setGlobalProcessing(false);

      mintFormRef.current?.reset();
      stakeFormRef.current?.reset();
      unstakeFormRef.current?.reset();
    }
  }, [receipt]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    functionName: 'mint' | 'stake' | 'unstake'
  ) {
    e.preventDefault();

    if (!address) {
      toast.error('Wallet not connected! Please connect your wallet.');
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const tokenIdString = formData.get('tokenId') as string;

    if (!tokenIdString) {
      toast.error('Please enter a Token ID.');
      return;
    }

    // Check if input is a valid positive integer
    if (!/^\d+$/.test(tokenIdString)) {
      toast.error('Invalid Token ID. Please enter a number.');
      return;
    }

    const tokenId = BigInt(tokenIdString);

    try {
      setIsLoading(true);
      setGlobalProcessing(true);
      toast.info(`Processing ${functionName} transaction...`);

      const hash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi,
        functionName,
        args: functionName === 'mint' ? [address as `0x${string}`, tokenId] : [tokenId],
      });

      setTxHash(hash);
      toast.success('Transaction submitted! ✅');
    } catch (error: any) {
      setGlobalProcessing(false);
      handleTransactionError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen foreground">
      <div className="max-w-md mx-auto bg-content shadow-lg rounded-xl p-8 space-y-8">
        <h2 className="text-2xl font-bold text-foreground text-center">NFT Mint & Stake</h2>

        {['mint', 'stake', 'unstake'].map((action) => (
          <form
            key={action}
            ref={action === 'mint' ? mintFormRef : action === 'stake' ? stakeFormRef : unstakeFormRef}
            onSubmit={(e) => handleSubmit(e, action as 'mint' | 'stake' | 'unstake')}
          >
            <div className="relative">
              <Input
                data-testid={`${action}-tokenId`}
                name="tokenId"
                placeholder="Enter Token ID"
                validateOnInvalid
                validateOnInput
                required
              />
            </div>
            <Button
              disabled={isLoading || isWaiting}
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              {(isLoading || isWaiting) && <Loader2 className="animate-spin w-5 h-5" />}
              {isLoading || isWaiting ? 'Processing...' : `${action.charAt(0).toUpperCase() + action.slice(1)} NFT`}
            </Button>
          </form>
        ))}

        {txHash && <TransactionHash txHash={txHash} />}
      </div>
    </div>
  );
}
