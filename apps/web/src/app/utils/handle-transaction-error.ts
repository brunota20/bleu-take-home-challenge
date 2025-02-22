import { toast } from "react-toastify";

export function handleTransactionError(error: any) {
  if (!error) return;

  const errorMessage = error.message?.toLowerCase();
  console.log(errorMessage)

  // Handle user rejection or cancellation
  if (error.code === 4001 || errorMessage?.includes("user denied transaction signature") || errorMessage?.includes("user rejected the request")) {
    toast.warning("Transaction was canceled ❌");
  }
  // Handle insufficient funds
  else if (errorMessage?.includes("insufficient funds")) {
    toast.error("Insufficient funds to complete the transaction.");
  }
  // Handle contract-specific errors
  else if (errorMessage?.includes("reverted") || errorMessage?.includes("execution reverted")) {
    if (errorMessage?.includes("not staked")) {
      toast.error("This token is not currently staked.");
    } else if (errorMessage?.includes("not the staker")) {
      toast.error("You are not the original staker of this NFT. Only the staker can unstake it.");
    } else if (errorMessage?.includes("not the owner")) {
      toast.error("You are not the owner of this NFT.");
    } else if (errorMessage?.includes("already staked")) {
      toast.error("This token is already staked.");
    } else {
      toast.error("Transaction failed. It might have been rejected by the contract.");
    }
  }
  // Handle generic errors
  else {
    toast.error(`Error: ${error.message || "Something went wrong."}`);
  }
}
