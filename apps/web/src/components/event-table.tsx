'use client';

interface Event {
  id: string;
  from?: string;
  to?: string;
  tokenId: string;
  timestamp: string;
}

interface EventTableProps {
  title: string;
  events: Event[];
}

const truncateAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A';

const formatTimestamp = (timestamp: string) =>
  new Date(Number(timestamp) * 1000).toLocaleString();

export default function EventTable({ title, events }: EventTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">{title}</h2>
      <table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr className="text-left text-gray-700">
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
              className={`border-t border-gray-200 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-gray-100 transition`}
            >
              {event.from && <td className="px-4 py-3 text-blue-500 font-mono">{truncateAddress(event.from)}</td>}
              {event.to && <td className="px-4 py-3 text-green-500 font-mono">{truncateAddress(event.to)}</td>}
              <td className="px-4 py-3 font-semibold">{event.tokenId}</td>
              <td className="px-4 py-3 text-gray-600">{formatTimestamp(event.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
