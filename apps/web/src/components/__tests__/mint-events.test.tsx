import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_MINT_EVENTS } from '@/app/queries/get-mint-events';
import '@testing-library/jest-dom';
import MintEvents from '../mint-events';

const mockData = {
  transferEvents: {
    items: [
      {
        id: '1',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        tokenId: '1001',
        timestamp: '1700000000',
      },
    ],
  },
};

const mocks = [
  {
    request: { query: GET_MINT_EVENTS },
    result: { data: mockData },
  },
];

test('renders loading state', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MintEvents />
    </MockedProvider>
  );

  expect(screen.getByText(/loading mint events/i)).toBeInTheDocument();
});

test('renders mint events correctly', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MintEvents />
    </MockedProvider>
  );

  expect(await screen.findByText('Mint Events')).toBeInTheDocument();
  expect(await screen.findByText('0xabcd...abcd')).toBeInTheDocument();
  expect(await screen.findByText('1001')).toBeInTheDocument();
  expect(await screen.findByText('14/11/2023, 19:13:20')).toBeInTheDocument();
});

test('renders error state', async () => {
  const errorMock = [
    {
      request: { query: GET_MINT_EVENTS },
      error: new Error('GraphQL error'),
    },
  ];

  render(
    <MockedProvider mocks={errorMock} addTypename={false}>
      <MintEvents />
    </MockedProvider>
  );

  expect(await screen.findByText(/error: graphql error/i)).toBeInTheDocument();
});
