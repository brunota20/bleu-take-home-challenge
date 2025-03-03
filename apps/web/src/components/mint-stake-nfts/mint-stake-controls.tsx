"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/text-input";
import { Loader2 } from "lucide-react";
import { useMintStake } from "@/hooks/useMintStake";
import TransactionHash from "../transaction-hash";
import ContractOwnerCheck from "./contract-owner-check";

export default function MintStakeControls() {
  const { txHash, isLoading, isWaiting, isError, contractOwner, formRefs, handleTransaction } = useMintStake();

  return (
    <div className="min-h-screen foreground">
      <div className="max-w-md mx-auto bg-content shadow-lg rounded-xl p-8 space-y-8">
        <h2 className="text-2xl font-bold text-foreground text-center">NFT Mint & Stake</h2>

        <ContractOwnerCheck contractOwner={contractOwner as `0x${string}`} />

        {(["mint", "stake", "unstake"] as const).map((action) => (
          <MintStakeForm key={action} action={action} formRef={formRefs[action] as React.RefObject<HTMLFormElement>} handleTransaction={handleTransaction} isDisabled={isLoading || isWaiting || isError} />
        ))}

        {txHash && <TransactionHash txHash={txHash} />}
      </div>
    </div>
  );
}

function MintStakeForm({ action, formRef, handleTransaction, isDisabled }: { action: "mint" | "stake" | "unstake"; formRef: React.RefObject<HTMLFormElement>; handleTransaction: (e: React.FormEvent<HTMLFormElement>, action: "mint" | "stake" | "unstake") => void; isDisabled: boolean }) {
  return (
    <form ref={formRef} onSubmit={(e) => handleTransaction(e, action)}>
      <div className="relative">
        <Input data-testid={`${action}-tokenId`} name="tokenId" placeholder="Enter Token ID" validateOnInvalid validateOnInput required disabled={isDisabled} />
      </div>
      <Button disabled={isDisabled} type="submit" className="w-full mt-2 flex items-center justify-center gap-2">
        {isDisabled && <Loader2 className="animate-spin w-5 h-5" />}
        {isDisabled ? "Processing..." : `${action.charAt(0).toUpperCase() + action.slice(1)} NFT`}
      </Button>
    </form>
  );
}
