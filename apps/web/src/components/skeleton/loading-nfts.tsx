export default function LoadingSkeleton() {
  return (
    <div className="flex-col mt-4">
      <h2 className="text-2xl text-center font-bold text-[rgb(var(--foreground))] mb-4">
        Your NFTs
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div
          className="p-2 rounded-lg bg-[rgb(var(--skeleton))] animate-pulse w-full md:w-1/2 h-10"
        ></div>
        <div
          className="p-2 rounded-lg bg-[rgb(var(--skeleton))] animate-pulse w-full md:w-1/2 h-10"
        ></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-[rgb(var(--skeleton))] h-40 rounded-lg"
          ></div>
        ))}
      </div>
    </div>
  );
}