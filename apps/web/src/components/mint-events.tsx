// components/MintEvents.tsx
'use client';

import { gql, useQuery } from '@apollo/client';
import EventTable from './event-table';

const GET_MINT_EVENTS = gql`
  query GetMintEvents {
    transferEventss(limit: 10, where: { eventType: MINT }, orderBy: "timestamp", orderDirection: "desc") {
      items {
        id
        to
        tokenId
        timestamp
      }
    }
  }
`;

export default function MintEvents() {
  const { data, loading, error } = useQuery(GET_MINT_EVENTS);

  if (loading) return <p>Loading Mint Events...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return <EventTable title="Mint Events" events={data?.transferEventss?.items || []} />;
}
