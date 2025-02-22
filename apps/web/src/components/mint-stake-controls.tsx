'use client';

import { useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
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
import { contractAddress } from '@/app/utils/contractAddress';
import ContractOwnerCheck from './contract-owner-check';

export default function MintStakeControls() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isError, setIsError] = useState(false);

  const formRefs = {
    mint: useRef<HTMLFormElement>(null),
    stake: useRef<HTMLFormElement>(null),
    unstake: useRef<HTMLFormElement>(null),
  };

  type FormAction = 'mint' | 'stake' | 'unstake';

  const { data: receipt, isLoading: isWaitingReceipt, error: transactionError, isError: isErrorTransaction } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  // Fetch contract owner only once
  const { data: contractOwner } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'owner',
  });

  useEffect(() => {
    if (receipt) {
      toast.success(
        <div>
          Transaction confirmed!{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${receipt.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500 hover:text-blue-700"
          >
            View on Etherscan
          </a>
        </div>
      );

      setIsLoading(false);
      setIsWaiting(false);
      setIsError(false);
      setGlobalProcessing(false);
      setTxHash(undefined);

      // Reset form fields
      Object.values(formRefs).forEach((ref) => ref.current?.reset());
    }
  }, [receipt]);


  useEffect(() => {
    if (isErrorTransaction && transactionError) {
      handleTransactionError(transactionError);
      setIsLoading(false);
      setIsWaiting(false);
      setIsError(false);
      setGlobalProcessing(false);
    }
  }, [isErrorTransaction, transactionError]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    functionName: 'mint' | 'stake' | 'unstake',
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
      setIsWaiting(true);
      setGlobalProcessing(true);
      toast.info(`Processing ${functionName} transaction...`);

      const hash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName,
        args: functionName === 'mint' ? [address as `0x${string}`, tokenId] : [tokenId],
      });

      setTxHash(hash);
      toast.success('Transaction submitted! ✅');
    } catch (error: any) {
      setIsError(true);
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

        <ContractOwnerCheck contractOwner={contractOwner as `0x${string}`} />

        {['mint', 'stake', 'unstake'].map((action) => (
          <form
            key={action}
            ref={formRefs[action as FormAction]}
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
                disabled={isLoading || isWaiting || isError}
              />
            </div>
            <Button
              disabled={isLoading || isWaiting || isError}
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              {(isLoading || isWaiting || isError) && <Loader2 className="animate-spin w-5 h-5" />}
              {isLoading || isWaiting || isError ? 'Processing...' : `${action.charAt(0).toUpperCase() + action.slice(1)} NFT`}
            </Button>
          </form>
        ))}

        {txHash && <TransactionHash txHash={txHash} />}
      </div>
    </div>
  );
}