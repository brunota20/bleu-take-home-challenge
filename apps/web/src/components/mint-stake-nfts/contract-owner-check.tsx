import CopyButton from '../copy-button';

interface ContractOwnerCheckProps {
    contractOwner: string;
}

export default function ContractOwnerCheck({contractOwner}: ContractOwnerCheckProps) {
  return (
    <div className="p-4 bg-content shadow-lg rounded-md">
      <span className="font-semibold block">Contract Owner:</span>
      <CopyButton address={contractOwner as `0x${string}`}/>
    </div>
  );
}
