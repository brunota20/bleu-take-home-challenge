import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

interface NavLinkProps {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavLink({ href, disabled = false, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (disabled) {
    return (
      <span
        className={cn(
          'text-content-foreground hover:text-primary/80 cursor-not-allowed opacity-50',
          isActive && 'text-primary'
        )}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn('text-content-foreground hover:text-primary/80', isActive && 'text-primary')}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}