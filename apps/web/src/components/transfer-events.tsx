// components/TransferEvents.tsx
'use client';

import { gql, useQuery } from '@apollo/client';
import EventTable from './event-table';

const GET_TRANSFER_EVENTS = gql`
  query GetTransferEvents {
    transferEventss(limit: 10, where: { eventType: TRANSFER }, orderBy: "timestamp", orderDirection: "desc") {
      items {
        id
        from
        to
        tokenId
        timestamp
      }
    }
  }
`;

export default function TransferEvents() {
  const { data, loading, error } = useQuery(GET_TRANSFER_EVENTS);

  if (loading) return <p>Loading Transfer Events...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return <EventTable title="Transfer Events" events={data?.transferEventss?.items || []} />;
}
