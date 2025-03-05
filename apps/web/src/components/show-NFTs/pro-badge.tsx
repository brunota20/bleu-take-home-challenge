import Image from 'next/image';
import ProStamp from '@/public/pro.png';
import { truncateAddress } from '@/app/utils/functions';
import Link from 'next/link';

interface ProBadgeProps {
  isPro: boolean;
  attestationId: string;
}

export default function ProBadge({ isPro, attestationId }: ProBadgeProps) {
  if (!isPro) return null;
  return (
    <div className="flex flex-col items-center">
      <Image
        src={ProStamp}
        alt="Pro Stamp"
        width={150}
        height={150}
        className="rounded-full"
        unoptimized
      />
      <p className="mt-2 text-sm text-gray-500">
        Attested by <strong>EAS</strong> (ID: {truncateAddress(attestationId)})
      </p>
      <Link
        href={`https://sepolia.easscan.org/attestation/view/${attestationId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 text-blue-500 hover:underline text-sm"
      >
        View on EAS
      </Link>
    </div>
  );
}

