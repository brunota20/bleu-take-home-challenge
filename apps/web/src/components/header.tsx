'use client';

import { useThemeStore } from '@/store/useThemeStore';
import { Moon, Menu } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { ConnectWalletButton } from './connect-wallet-button';
import NavLink from './nav-link';
import { Button } from './ui/button';
import { useMintStakeStatus } from '@/hooks/useMintStakeStatus';

const Header = () => {
  const { toggleTheme } = useThemeStore();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { isProcessing } = useMintStakeStatus();

  return (
    <header className="flex items-center justify-between bg-content mx-5 mt-6 px-5 py-4 rounded-4xl relative">
      <Link href="/">
        <h1 className="text-primary font-bold text-lg font-roboto-mono">Bleu</h1>
      </Link>

      <nav className="hidden md:flex gap-6 text-lg">
        <NavLink href="/" disabled={isProcessing}>Mint & Stake</NavLink>
        <NavLink href="/nfts-showcase" disabled={isProcessing}>Your NFTs</NavLink>
        <NavLink href="/mint-events-showcase" disabled={isProcessing}>Mint Events</NavLink>
        <NavLink href="/transfer-events-showcase" disabled={isProcessing}>Transfer Events</NavLink>
      </nav>

      <div className="flex items-center gap-2">
        <ConnectWalletButton />
        <Button
          variant="ghost"
          className="flex items-center justify-center rounded-full bg-primary/10 p-1 w-8 h-8"
          onClick={() => toggleTheme()}
        >
          <Moon size={18} className="text-primary" />
        </Button>

        <Button
          variant="ghost"
          className="md:hidden flex items-center justify-center rounded-full bg-primary/10 p-1 w-8 h-8"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={18} className="text-primary" />
        </Button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-content p-4 flex flex-col items-center space-y-3 shadow-md md:hidden z-50">
          <NavLink href="/" onClick={() => setMenuOpen(false)} disabled={isProcessing}>Mint & Stake</NavLink>
          <NavLink href="/nfts-showcase" onClick={() => setMenuOpen(false)} disabled={isProcessing}>Your NFTs</NavLink>
          <NavLink href="/transfer-events-showcase" onClick={() => setMenuOpen(false)} disabled={isProcessing}>Transfer Events</NavLink>
          <NavLink href="/mint-events-showcase" onClick={() => setMenuOpen(false)} disabled={isProcessing}>Mint Events</NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
