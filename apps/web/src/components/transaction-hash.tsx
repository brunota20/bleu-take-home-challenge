import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

interface TransactionHashProps {
  txHash: string;
}


export default function TransactionHash({ txHash }: TransactionHashProps) {

  return (
    <div className="text-center text-sm text-sub-text mt-4 p-2 bg-content/50 rounded-lg">
            <span className="font-semibold block">Transaction Hash:</span>
            <div className="flex items-center justify-center gap-2">
              <span className="truncate max-w-[200px] md:max-w-[300px]">{`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:text-primary/80 transition"
                onClick={() => {
                  if (!txHash) {
                    toast.error("No transaction hash available to copy.");
                    return;
                  }
                  navigator.clipboard.writeText(txHash);
                  toast.success("Transaction hash copied to clipboard!");
                }}
              >
                <Copy className="w-5 h-5" />
              </Button>
            </div>
          </div>
  );
}
