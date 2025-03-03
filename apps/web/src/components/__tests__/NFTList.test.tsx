import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StakedSummary from '../show-NFTs/staked-summary';
import Filters from '../show-NFTs/filters';
import { MockedProvider } from '@apollo/client/testing';
import { GET_NFTS } from '@/app/queries/get-nfts';
import { NFT } from '@/app/utils/types';
import NFTList from '../show-NFTs/nft-list';
import NFTHeader from '../show-NFTs/nft-header';
import ProBadge from '../show-NFTs/pro-badge';
import NFTDisplay from '../show-NFTs/nft-display';
import NFTGrid from '../show-NFTs/nft-grid';

jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({ address: '0x123' })),
}));

const mockNFTs = [
  { tokenId: '1', staked: true },
  { tokenId: '2', staked: false },
];

const mocks = [
  {
    request: {
      query: GET_NFTS,
      variables: { owner: '0x123' },
    },
    result: {
      data: {
        nfts: { items: mockNFTs },
        userStakedCount: { stakedCount: 6, isPro: true },
        globalStaked: { totalCount: 10 },
      },
    },
  },
];

describe('NFT Components Tests', () => {
  test('renders NFTList correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <NFTList />
      </MockedProvider>
    );
    expect(await screen.findByText(/Your Staked NFTs/)).toBeInTheDocument();
  });

  test('renders StakedSummary with correct props', () => {
    render(<StakedSummary totalStakedByOwner={6} totalStakedGlobally={10} />);
    expect(screen.getByText('Your Staked NFTs')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Global Staked NFTs')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('renders NFTHeader with correct elements', () => {
    render(
      <NFTHeader
        isPro={true}
        searchTerm=""
        attestationId=""
        setSearchTerm={jest.fn()}
        filterStaked="all"
        setFilterStaked={jest.fn()}
      />
    );
    expect(screen.getByText('Your NFTs')).toBeInTheDocument();
  });

  test('renders ProBadge only when isPro is true', () => {
    const { rerender } = render(<ProBadge isPro={true} attestationId=""/>);
    expect(screen.getByAltText('Pro Stamp')).toBeInTheDocument();

    rerender(<ProBadge isPro={false} attestationId=""/>);
    expect(screen.queryByAltText('Pro Stamp')).toBeNull();
  });

  test('Filters updates search term and filter selection', () => {
    const setSearchTerm = jest.fn();
    const setFilterStaked = jest.fn();

    render(
      <Filters
        searchTerm=""
        setSearchTerm={setSearchTerm}
        filterStaked="all"
        setFilterStaked={setFilterStaked}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Search by Token ID'), { target: { value: '1' } });
    expect(setSearchTerm).toHaveBeenCalledWith('1');

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'staked' } });
    expect(setFilterStaked).toHaveBeenCalledWith('staked');
  });


  test('NFTDisplay shows message when no NFTs are found', () => {
    render(<NFTDisplay filteredNFTs={[]} onTransferSuccess={jest.fn()} />);
    expect(screen.getByText(/No NFTs match your filters/i)).toBeInTheDocument();
  });

  test('NFTGrid renders correct number of NFTCards', () => {
    render(<NFTGrid filteredNFTs={mockNFTs as NFT[]} onTransferSuccess={jest.fn()} />);    
    expect(screen.getAllByTestId('nft-card').length).toBe(mockNFTs.length);
  });

});