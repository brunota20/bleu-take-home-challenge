import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { truncateAddress } from "@/app/utils/functions";

interface CopyButtonProps {
    address: string;
    errorMessage?: string;
    successMessage?: string;
}

export default function CopyButton({address, errorMessage, successMessage}: CopyButtonProps) {

  return (
    <div className="flex items-center justify-center gap-2">
        <span className="truncate max-w-[200px] md:max-w-[300px]">{truncateAddress(address)}</span>
        <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:text-primary/80 transition"
            onClick={() => {
                if (!address) {
                errorMessage && toast.error(errorMessage);
                return;
                }
                navigator.clipboard.writeText(address);
                successMessage && toast.success(successMessage);
            }}
            >
            <Copy className="w-5 h-5" />
        </Button>
    </div>
  );
}
