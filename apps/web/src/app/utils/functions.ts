export const truncateAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A';

export const formatTimestamp = (timestamp: string) =>
  new Date(Number(timestamp) * 1000).toLocaleString();