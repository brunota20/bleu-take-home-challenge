import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventTable from '../event-table';

const mockEvents = [
  {
    id: '1',
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    tokenId: '1001',
    timestamp: '1700000000',
  },
  {
    id: '2',
    from: '0xaabbccddeeff00112233445566778899aabbccdd',
    to: '0xccddeeffaabb00112233445566778899aabbccff',
    tokenId: '1002',
    timestamp: '1700000100',
  },
];

test('renders transfer events in table', () => {
  render(<EventTable events={mockEvents} />);

  expect(screen.getByText('1001')).toBeInTheDocument();
  expect(screen.getByText('1002')).toBeInTheDocument();
  expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
  expect(screen.getByText('0xabcd...abcd')).toBeInTheDocument();
});

test('renders correctly with empty event list', () => {
  render(<EventTable events={[]} />);
  expect(screen.queryByText('1001')).not.toBeInTheDocument();
});
