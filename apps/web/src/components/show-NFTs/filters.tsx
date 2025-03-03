'use client';

import { Input } from "../ui/text-input";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStaked: 'all' | 'staked' | 'unstaked';
  setFilterStaked: (value: 'all' | 'staked' | 'unstaked') => void;
}

export default function Filters({ searchTerm, setSearchTerm, filterStaked, setFilterStaked }: FiltersProps) {
  return (
    <div className="flex justify-between items-center d:flex-row gap-4">
      <Input
        type="text"
        placeholder="Search by Token ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={filterStaked}
        onChange={(e) => setFilterStaked(e.target.value as 'all' | 'staked' | 'unstaked')}
        className="p-2 border rounded-lg bg-content text-content-foreground border-sub-text"
      >
        <option value="all">All</option>
        <option value="staked">Staked</option>
        <option value="unstaked">Unstaked</option>
      </select>
    </div>
  );
}