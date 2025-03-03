import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { NFT } from '@/app/utils/types';
import { GET_NFTS } from '@/app/queries/get-nfts';

export function useNFTs() {
  const { address } = useAccount();
  const { data, loading, error, refetch } = useQuery(GET_NFTS, {
    variables: { owner: address },
    fetchPolicy: 'no-cache',
  });

  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [stakedCount, setStakedCount] = useState<number>(0);
  const [totalStakedCount, setTotalStakedCount] = useState<number>(0);
  const [attestationId, setAttestationId] = useState<string>('');
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setNFTs(data?.nfts?.items || []);
      setStakedCount(data?.userStakedCount?.stakedCount || 0);
      setAttestationId(data?.userStakedCount?.attestationUID || '');
      setTotalStakedCount(data?.globalStaked?.totalCount || 0);
      setIsPro(data?.userStakedCount?.isPro || false);
    }
  }, [data]);

  return { address, nfts, stakedCount, totalStakedCount, attestationId, isPro, loading, error, refetch };
}
