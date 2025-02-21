import Image from 'next/image';
import ProStamp from '@/public/pro.png';

interface ProBadgeProps {
  isPro: boolean;
}

export default function ProBadge({ isPro }: ProBadgeProps) {
  if (!isPro) return null;
  return (
    <Image
      src={ProStamp}
      alt="Pro Stamp"
      width={150}
      height={150}
      className="rounded-full"
      unoptimized
    />
  );
}
