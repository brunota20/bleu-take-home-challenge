'use client';

interface Event {
  id: string;
  from?: string;
  to?: string;
  tokenId: string;
  timestamp: string;
}

interface EventTableProps {
  events: Event[];
}

const truncateAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A';

const formatTimestamp = (timestamp: string) =>
  new Date(Number(timestamp) * 1000).toLocaleString();

export default function EventTable({ events }: EventTableProps) {

  return (
    <div className="w-full overflow-x-auto">
      <table
        className="w-full border shadow-lg rounded-lg overflow-hidden transition-all bg-[rgb(var(--content))] border-[rgb(var(--sub-text))]"
      >
        <thead className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
          <tr className="text-left">
            {events.some((e) => e.from) && <th className="px-4 py-3">From</th>}
            {events.some((e) => e.to) && <th className="px-4 py-3">To</th>}
            <th className="px-4 py-3">Token ID</th>
            <th className="px-4 py-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr
              key={event.id}
              className={`border-t transition ${
                index % 2 === 0
                  ? 'bg-[rgb(var(--content))]'
                  : 'bg-[rgb(var(--background))]'
              } border-[rgb(var(--sub-text))]`}
            >
              {event.from && (
                <td className="px-4 py-3 font-mono text-[rgb(var(--primary))]">
                  {truncateAddress(event.from)}
                </td>
              )}
              {event.to && (
                <td className="px-4 py-3 font-mono text-[rgb(var(--success))]">
                  {truncateAddress(event.to)}
                </td>
              )}
              <td className="px-4 py-3 font-semibold text-[rgb(var(--content-foreground))]">
                {event.tokenId}
              </td>
              <td className="px-4 py-3 text-[rgb(var(--sub-text))]">
                {formatTimestamp(event.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}