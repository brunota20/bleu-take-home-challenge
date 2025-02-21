'use client';

interface StakedSummaryProps {
  totalStakedByOwner: number;
  totalStakedGlobally: number;
}

export default function StakedSummary({ totalStakedByOwner, totalStakedGlobally }: StakedSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 rounded-lg bg-content border border-sub-text flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold text-foreground">
          Your Staked NFTs
        </h3>
        <p className="text-sub-text">{totalStakedByOwner}</p>
      </div>
      <div className="p-4 rounded-lg bg-content border border-sub-text flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold text-foreground">
          Global Staked NFTs
        </h3>
        <p className="text-sub-text">{totalStakedGlobally}</p>
      </div>
    </div>
  );
}