'use client';

interface StakedSummaryProps {
  totalStakedByOwner: number;
  totalStakedGlobally: number;
}

export default function StakedSummary({ totalStakedByOwner, totalStakedGlobally }: StakedSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="p-4 rounded-lg bg-[rgb(var(--content))] border border-[rgb(var(--sub-text))] flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
          Your Staked NFTs
        </h3>
        <p className="text-[rgb(var(--sub-text))]">{totalStakedByOwner}</p>
      </div>
      <div className="p-4 rounded-lg bg-[rgb(var(--content))] border border-[rgb(var(--sub-text))] flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
          Global Staked NFTs
        </h3>
        <p className="text-[rgb(var(--sub-text))]">{totalStakedGlobally}</p>
      </div>
    </div>
  );
}