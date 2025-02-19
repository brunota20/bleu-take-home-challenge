interface EventTableSkeletonProps {
  title: string;
}

export default function EventTableSkeleton({ title }: EventTableSkeletonProps) {
  return (
    <div className="flex-col mt-4 w-full overflow-x-auto">
      <h2 className="text-2xl text-center font-bold text-foreground mb-4">{title}</h2>
      <table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden animate-pulse">
        <thead className="bg-gray-100">
          <tr className="text-left text-gray-700">
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">To</th>
            <th className="px-4 py-3">Token ID</th>
            <th className="px-4 py-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
