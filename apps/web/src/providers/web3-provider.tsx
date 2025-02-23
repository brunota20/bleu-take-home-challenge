'use client';

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { useEffect, useState, type ReactNode } from 'react';
import { http, WagmiProvider, Config  } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css'


const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
//   const [config, setConfig] = useState<Config | null>(null);

// useEffect(() => {
//     const clientConfig = getDefaultConfig({
//       appName: 'Next Bleu Starter',
//       projectId: "Next Bleu Starter",
//       appDescription: 'Template for web3 next projects',
//       appUrl: 'http://localhost:3000',
//       appIcon: 'https://cdn-icons-png.flaticon.com/128/4064/4064205.png',
//       chains: [sepolia],
//       transports: {
//         [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
//       },
//     });
//     setConfig(clientConfig);
//   }, []);

  // if (!config) {
  //   return <div>Loading...</div>;
  // }
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
