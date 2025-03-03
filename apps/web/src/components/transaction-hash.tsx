import CopyButton from "./copy-button";

interface TransactionHashProps {
  txHash: string;
}


export default function TransactionHash({ txHash }: TransactionHashProps) {

  return (
    <div className="text-center text-sm text-sub-text mt-4 p-2 bg-content/50 rounded-lg">
      <span className="font-semibold block">Transaction Hash:</span>
      <CopyButton address={txHash} errorMessage="No transaction hash available to copy." successMessage="Transaction hash copied to clipboard!"/>
    </div>
  );
}
