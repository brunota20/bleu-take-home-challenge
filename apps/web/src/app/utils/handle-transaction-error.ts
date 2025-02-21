import { toast } from "react-toastify";

export function handleTransactionError(error: any) {
  if (!error) return;

  const errorMessage = error.message?.toLowerCase();

  if (error.code === 4001 || errorMessage?.includes("user denied transaction signature") || errorMessage?.includes("user rejected the request")) {
    toast.warning("Transaction was canceled ❌");
  } else if (errorMessage?.includes("insufficient funds")) {
    toast.error("Insufficient funds to complete the transaction.");
  } else if (errorMessage?.includes("reverted") || errorMessage?.includes("execution reverted")) {
    toast.error("Transaction failed. It might have been rejected by the contract.");
  } else {
    toast.error(`Error: ${error.message || "Something went wrong."}`);
  }
}
