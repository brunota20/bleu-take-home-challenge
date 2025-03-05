import { useState, useEffect, useRef } from "react";
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { abi } from "@/app/utils/abis/BleuNFTABI";
import { toast } from "react-toastify";
import { setGlobalProcessing } from "@/hooks/useMintStakeStatus";
import { handleTransactionError } from "../app/utils/handle-transaction-error";
import { contractAddress } from "@/app/utils/contractAddress";
import Link from "next/link";

export type FormAction = "mint" | "stake" | "unstake";

export function useMintStake() {
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

  const { data: receipt, error: transactionError, isError: isErrorTransaction } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  const { data: contractOwner } = useReadContract({
    address: contractAddress,
    abi,
    functionName: "owner",
  });

  useEffect(() => {
    if (receipt) {
      toast.success(
        <div>
          Transaction confirmed!{" "}
          <Link
            href={`https://sepolia.etherscan.io/tx/${receipt.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500 hover:text-blue-700"
          >
            View on Etherscan
          </Link>
        </div>
      );

      setIsLoading(false);
      setIsWaiting(false);
      setIsError(false);
      setGlobalProcessing(false);
      setTxHash(undefined);

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

  async function handleTransaction(e: React.FormEvent<HTMLFormElement>, action: FormAction) {
    e.preventDefault();

    if (!address) {
      toast.error("Wallet not connected! Please connect your wallet.");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const tokenIdString = formData.get("tokenId") as string;

    if (!tokenIdString || !/^\d+$/.test(tokenIdString)) {
      toast.error("Invalid Token ID. Please enter a valid number.");
      return;
    }

    const tokenId = BigInt(tokenIdString);

    try {
      setIsLoading(true);
      setIsWaiting(true);
      setGlobalProcessing(true);
      toast.info(`Processing ${action} transaction...`);

      const hash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: action,
        args: action === "mint" ? [address as `0x${string}`, tokenId] : [tokenId],
      });

      setTxHash(hash);
      toast.success("Transaction submitted! ✅");
    } catch (error: any) {
      setIsError(true);
      setGlobalProcessing(false);
      handleTransactionError(error);
    } finally {
      setIsLoading(false);
      setIsWaiting(false);
      setIsError(false);
    }
  }

  return {
    txHash,
    isLoading,
    isWaiting,
    isError,
    contractOwner,
    formRefs,
    handleTransaction,
  };
}
