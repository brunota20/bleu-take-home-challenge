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
        className="w-full border shadow-lg rounded-lg overflow-hidden transition-all bg-content border-sub-text"
      >
        <thead className="bg-background text-foreground">
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
                  ? 'bg-content'
                  : 'bg-background'
              } border-sub-text`}
            >
              {event.from && (
                <td className="px-4 py-3 font-mono text-primary">
                  {truncateAddress(event.from)}
                </td>
              )}
              {event.to && (
                <td className="px-4 py-3 font-mono text-success">
                  {truncateAddress(event.to)}
                </td>
              )}
              <td className="px-4 py-3 font-semibold text-content-foreground">
                {event.tokenId}
              </td>
              <td className="px-4 py-3 text-sub-text">
                {formatTimestamp(event.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}