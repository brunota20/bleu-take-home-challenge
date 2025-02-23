'use client';

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css'


const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {

  const config = getDefaultConfig({
    appName: 'Next Bleu Starter',
    projectId: 'YOUR_PROJECT_ID',
    chains: [
      mainnet,
      polygon,
      optimism,
      arbitrum,
      base,
      ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ],
    appDescription: 'Template for web3 next projects',
    appUrl: 'http://localhost:3000',
    appIcon: 'https://cdn-icons-png.flaticon.com/128/4064/4064205.png',
    ssr: true,
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
