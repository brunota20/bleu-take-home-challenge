import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useWriteContract, useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';
import MintStakeControls from '../mint-stake-controls';

jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({ address: '0xabcdef1234567890' })),
  useWaitForTransactionReceipt: jest.fn(() => ({ data: null, isLoading: false })),
  useWriteContract: jest.fn(() => ({
    writeContractAsync: jest.fn().mockResolvedValue('0xmockedTransactionHash'),
    data: null,
    variables: null,
    error: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
  })),
}));


jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

describe('MintStakeControls Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component correctly', () => {
    (useAccount as jest.Mock).mockReturnValue({ address: '0xabcdef1234567890' });
    render(<MintStakeControls />);

    expect(screen.getByText('NFT Mint & Stake')).toBeInTheDocument();
    expect(screen.getByTestId('mint-tokenId')).toBeInTheDocument();
  });

  test('displays error when wallet is not connected', async () => {
    (useAccount as jest.Mock).mockReturnValue({ address: undefined });

    render(<MintStakeControls />);

    const mintForm = screen.getByTestId('mint-tokenId').closest("form");
    if (mintForm) fireEvent.submit(mintForm);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Wallet not connected! Please connect your wallet.');
    });
  });

  test('displays error when Token ID is missing', async () => {
    (useAccount as jest.Mock).mockReturnValue({ address: '0xabcdef1234567890' });

    render(<MintStakeControls />);

    const mintForm = screen.getByTestId('mint-tokenId').closest("form");
    if (mintForm) fireEvent.submit(mintForm);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid Token ID');
    });
  });

  test('handles successful mint transaction', async () => {
    (useAccount as jest.Mock).mockReturnValue({ address: '0xabcdef1234567890' });
    (useWriteContract as jest.Mock).mockReturnValue({
      writeContractAsync: jest.fn().mockResolvedValue('0x123456'),
    });

    render(<MintStakeControls />);

    fireEvent.change(screen.getByTestId('mint-tokenId'), {
      target: { value: '1001' },
    });

    fireEvent.click(screen.getByText('Mint NFT'));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith('Processing mint transaction...');
      expect(toast.success).toHaveBeenCalledWith('Transaction submitted! ✅');
    });
  });

  test('handles user rejection', async () => {
    (useAccount as jest.Mock).mockReturnValue({ address: '0xabcdef1234567890' });
    (useWriteContract as jest.Mock).mockReturnValue({
      writeContractAsync: jest.fn().mockRejectedValue({ code: 4001, message: 'User denied transaction signature' }),
    });

    render(<MintStakeControls />);

    fireEvent.change(screen.getByTestId('mint-tokenId'), {
      target: { value: '1001' },
    });

    fireEvent.click(screen.getByText('Mint NFT'));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith('Transaction was canceled ❌');
    });
  });

  test('handles insufficient funds error', async () => {
    (useAccount as jest.Mock).mockReturnValue({ address: '0xabcdef1234567890' });
    (useWriteContract as jest.Mock).mockReturnValue({
      writeContractAsync: jest.fn().mockRejectedValue({ message: 'insufficient funds' }),
    });

    render(<MintStakeControls />);

    fireEvent.change(screen.getByTestId('mint-tokenId'), {
      target: { value: '1001' },
    });

    fireEvent.click(screen.getByText('Mint NFT'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Insufficient funds to complete the transaction.');
    });
  });

  test('handles general transaction failure', async () => {
    (useAccount as jest.Mock).mockReturnValue({ address: '0xabcdef1234567890' });
    (useWriteContract as jest.Mock).mockReturnValue({
      writeContractAsync: jest.fn().mockRejectedValue({ message: 'execution reverted' }),
    });

    render(<MintStakeControls />);

    fireEvent.change(screen.getByTestId('mint-tokenId'), {
      target: { value: '1001' },
    });

    fireEvent.click(screen.getByText('Mint NFT'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Transaction failed. It might have been rejected by the contract.');
    });
  });

  test('displays transaction hash after success', async () => {
    (useAccount as jest.Mock).mockReturnValue({ address: '0xabcdef1234567890' });
    (useWriteContract as jest.Mock).mockReturnValue({
      writeContractAsync: jest.fn().mockResolvedValue('0x123456'),
    });

    render(<MintStakeControls />);

    fireEvent.change(screen.getByTestId('mint-tokenId'), {
      target: { value: '1001' },
    });

    fireEvent.click(screen.getByText('Mint NFT'));

    await waitFor(() => {
      expect(screen.getByText('Transaction Hash:')).toBeInTheDocument();
      expect(screen.getByText('0x1234...3456')).toBeInTheDocument();
    });
  });
});
