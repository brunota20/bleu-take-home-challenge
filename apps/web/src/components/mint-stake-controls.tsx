'use client';

import * as React from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@/components/ui/button';
import { abi } from '@/app/utils/abis/BleuNFTABI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { Loader2, Copy } from 'lucide-react';

const CONTRACT_ADDRESS = "0xEe763b54Fb7b8De7871113Ac4654BE4AEA4681df";

export default function MintStakeControls() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { data: receipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  useEffect(() => {
    if (receipt) {
      toast.success(`Transaction confirmed! ✅`);
      setIsLoading(false);
    }
  }, [receipt]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, functionName: "mint" | "stake" | "unstake") {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tokenId = formData.get("tokenId") as string;

    if (!tokenId) {
      toast.error("Please enter a valid Token ID");
      return;
    }

    if (!address) {
      toast.error("Wallet not connected! Please connect your wallet.");
      return;
    }

    try {
      setIsLoading(true);
      toast.info(`Processing ${functionName} transaction...`);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName,
        args: functionName === "mint" ? [address, BigInt(tokenId)] : [BigInt(tokenId)],
      });

      setTxHash(hash);
      toast.success(`Transaction submitted! ✅`);
    } catch (error: any) {
      console.error("Transaction error:", error);
      setIsLoading(false);
      toast.error(`Error: ${error.message || "Something went wrong."}`);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">NFT Mint & Stake</h2>

      {["mint", "stake", "unstake"].map((action) => (
        <form key={action} onSubmit={(e) => handleSubmit(e, action as "mint" | "stake" | "unstake")}>
          <div className="relative">
            <input
              name="tokenId"
              placeholder="Enter Token ID"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <Button
            disabled={isLoading || isWaiting}
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading || isWaiting ? <Loader2 className="animate-spin w-5 h-5" /> : null}
            {isLoading || isWaiting ? "Processing..." : `${action.charAt(0).toUpperCase() + action.slice(1)} NFT`}
          </Button>
        </form>
      ))}

      {txHash && (
        <div className="text-center text-sm text-gray-600 mt-4 p-2 bg-gray-100 rounded-lg">
            <span className="font-semibold block">Transaction Hash:</span>
            <div className="flex items-center justify-center gap-2">
            <span className="truncate max-w-[200px] md:max-w-[300px]">{`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}</span>
            <button
                className="text-blue-500 hover:text-blue-700 transition"
                onClick={() => {
                navigator.clipboard.writeText(txHash);
                toast.success("Transaction hash copied to clipboard!");
                }}
            >
                <Copy className="w-5 h-5 cursor-pointer" />
            </button>
            </div>
        </div>
      )}
    </div>
  );
}
