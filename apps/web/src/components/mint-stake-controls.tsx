'use client';

import * as React from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@/components/ui/button';
import { abi } from '@/app/utils/abis/BleuNFTABI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useRef } from 'react'; // Add useRef
import { Loader2, Copy } from 'lucide-react';
import TransactionHash from './transaction-hash';
import { setGlobalProcessing } from '@/hooks/useMintStakeStatus';

const contractAdress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

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
      toast.success(`Transaction confirmed! ✅`);
      setIsLoading(false);
      setGlobalProcessing(false);

      if (mintFormRef.current) mintFormRef.current.reset();
      if (stakeFormRef.current) stakeFormRef.current.reset();
      if (unstakeFormRef.current) unstakeFormRef.current.reset();
    }
  }, [receipt]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, functionName: "mint" | "stake" | "unstake") {
    e.preventDefault();

    if (!address) {
      toast.error("Wallet not connected! Please connect your wallet.");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const tokenId = formData.get("tokenId") as string;

    if (!tokenId) {
      toast.error("Please enter a valid Token ID");
      return;
    }

    if (!contractAdress || !contractAdress.startsWith("0x")) {
      toast.error("Contract address is invalid.");
      return;
    }

    try {
      setIsLoading(true);
      setGlobalProcessing(true);
      toast.info(`Processing ${functionName} transaction...`);

      const hash = await writeContractAsync({
        address: contractAdress as `0x${string}`,
        abi,
        functionName,
        args: functionName === "mint" ? [address as `0x${string}`, BigInt(tokenId)] : [BigInt(tokenId)],
      });

      setTxHash(hash);
      toast.success(`Transaction submitted! ✅`);
    } catch (error: any) {
      setGlobalProcessing(false);

      const errorMessage = error.message?.toLowerCase();

      if (error.code === 4001 || errorMessage?.includes("user denied transaction signature") || errorMessage?.includes("user rejected the request")) {
        toast.warning("Transaction was canceled by the user. ❌");
      } else if (errorMessage?.includes("insufficient funds")) {
        toast.error("Insufficient funds to complete the transaction.");
      } else if (errorMessage?.includes("reverted") || errorMessage?.includes("execution reverted")) {
        toast.error("Transaction failed. It might have been rejected by the contract.");
      } else {
        toast.error(`Error: ${error.message || "Something went wrong."}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen foreground">
      <div className="max-w-md mx-auto bg-content shadow-lg rounded-xl p-8 space-y-8">
        <h2 className="text-2xl font-bold text-foreground text-center">NFT Mint & Stake</h2>

        {["mint", "stake", "unstake"].map((action) => (
          <form
            key={action}
            ref={action === "mint" ? mintFormRef : action === "stake" ? stakeFormRef : unstakeFormRef} // Assign refs
            onSubmit={(e) => handleSubmit(e, action as "mint" | "stake" | "unstake")}
          >
            <div className="relative">
              <input
                name="tokenId"
                placeholder="Enter Token ID"
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please fill out this field.")}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                required
                className="w-full px-4 py-2 border border-sub-text rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
            <Button
              disabled={!address || isLoading || isWaiting}
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              {isLoading || isWaiting ? <Loader2 className="animate-spin w-5 h-5" /> : null}
              {isLoading || isWaiting ? "Processing..." : `${action.charAt(0).toUpperCase() + action.slice(1)} NFT`}
            </Button>
          </form>
        ))}

        {txHash && <TransactionHash txHash={txHash} />}
      </div>
    </div>
  );
}