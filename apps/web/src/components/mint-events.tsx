'use client';

import { useQuery } from '@apollo/client';
import EventTable from './event-table';
import EventTableSkeleton from './skeleton/events-table-skeleton';
import { GET_MINT_EVENTS } from '@/app/queries/get-mint-events';

export default function MintEvents() {
  const { data, loading, error } = useQuery(GET_MINT_EVENTS, {
    fetchPolicy: 'no-cache',
  });

  if (loading) return <EventTableSkeleton title="Loading Mint Events..." />;
  if (error) return <p className="text-error">Error: {error.message}</p>;

  const events = data?.transferEvents?.items || [];

  return (
    <div className='flex-col mt-4'>
      <h2 className="text-2xl text-center font-bold text-foreground mb-4">Mint Events</h2>
      {events.length === 0 ? (
        <p className="text-center text-sub-text">No mint events recorded yet. 🏗️</p>
      ) : (
        <EventTable events={events} />
      )}
    </div>
  );
}
