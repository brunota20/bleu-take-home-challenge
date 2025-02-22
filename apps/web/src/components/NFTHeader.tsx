import Filters from './filters';
import ProBadge from './pro-badge';

interface NFTHeaderProps {
  isPro: boolean;
  attestationId: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStaked: 'all' | 'staked' | 'unstaked';
  setFilterStaked: (value: 'all' | 'staked' | 'unstaked') => void;
}

export default function NFTHeader({
  isPro,
  attestationId,
  searchTerm,
  setSearchTerm,
  filterStaked,
  setFilterStaked,
}: NFTHeaderProps) {
  return (
    <div className="flex flex-row items-center mb-6">
      <div className="flex-1 flex items-center justify-start">
        <ProBadge isPro={isPro} attestationId={attestationId}/>
      </div>
      <h2 className="text-2xl font-bold text-foreground text-center flex-1">Your NFTs</h2>
      <div className="flex-1 flex justify-end">
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStaked={filterStaked}
          setFilterStaked={setFilterStaked}
        />
      </div>
    </div>
  );
}
