'use client';

import { useQuery } from '@apollo/client';
import EventTable from './event-table';
import EventTableSkeleton from './skeleton/events-table-skeleton';
import { GET_TRANSFER_EVENTS } from '@/app/queries/get-transfer-events';

export default function TransferEvents() {
  const { data, loading, error } = useQuery(GET_TRANSFER_EVENTS, {
    fetchPolicy: 'no-cache',
  });

  if (loading) return <EventTableSkeleton title='Loading Transfer Events...'/>;
  if (error) return <p className="text-error">Error: {error.message}</p>;

  const events = data?.transferEvents?.items || [];

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
