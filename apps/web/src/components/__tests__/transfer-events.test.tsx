import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_TRANSFER_EVENTS } from '@/app/queries/get-transfer-events';
import '@testing-library/jest-dom';
import TransferEvents from '../transfer-events';

const mockData = {
  transferEvents: {
    items: [
      {
        id: '1',
        from: '0x1234567890abcdef1234567890abcdef12345678',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        tokenId: '1001',
        timestamp: '1700000000',
      },
    ],
  },
};

const mocks = [
  {
    request: { query: GET_TRANSFER_EVENTS },
    result: { data: mockData },
  },
];

test('renders loading state', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <TransferEvents />
    </MockedProvider>
  );

  expect(screen.getByText(/loading transfer events/i)).toBeInTheDocument();
});

test('renders transfer events correctly', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <TransferEvents />
    </MockedProvider>
  );

  expect(await screen.findByText('Transfer Events')).toBeInTheDocument();
  expect(await screen.findByText('0x1234...5678')).toBeInTheDocument();
  expect(await screen.findByText('0xabcd...abcd')).toBeInTheDocument();
  expect(await screen.findByText('1001')).toBeInTheDocument();
});

test('renders error state', async () => {
  const errorMock = [
    {
      request: { query: GET_TRANSFER_EVENTS },
      error: new Error('GraphQL error'),
    },
  ];

  render(
    <MockedProvider mocks={errorMock} addTypename={false}>
      <TransferEvents />
    </MockedProvider>
  );

  expect(await screen.findByText(/error: graphql error/i)).toBeInTheDocument();
});
