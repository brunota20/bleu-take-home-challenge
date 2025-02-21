import { useState, useEffect } from 'react';

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
