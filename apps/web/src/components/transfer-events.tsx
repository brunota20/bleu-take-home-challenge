'use client';

import { gql, useQuery } from '@apollo/client';
import EventTable from './event-table';
import EventTableSkeleton from './skeleton/events-table-skeleton';

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

  if (loading) return <EventTableSkeleton title='Loading Transfer Events...'/>;
  if (error) return <p className="text-error">Error: {error.message}</p>;

  const events = data?.transferEventss?.items || [];

  return (
    <div className='flex-col mt-4'>
      <h2 className="text-2xl text-center font-bold text-foreground mb-4">Transfer Events</h2>
      {events.length === 0 ? (
        <p className="text-center text-sub-text">No transfer events recorded yet. 🚀</p>
      ) : (
        <EventTable events={events} />
      )}
    </div>
  );
}
