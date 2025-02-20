import { useState, useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

let globalSetProcessing: ((state: boolean) => void) | null = null;

export function useMintStakeStatus() {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    globalSetProcessing = setIsProcessing;
    return () => {
      globalSetProcessing = null;
    };
  }, []);

  return { isProcessing };
}

export function setGlobalProcessing(state: boolean) {
  if (globalSetProcessing) {
    globalSetProcessing(state);
  }
}
