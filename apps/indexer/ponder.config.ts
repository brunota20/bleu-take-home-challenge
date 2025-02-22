import { createConfig, mergeAbis } from 'ponder';
import { http } from 'viem';
import { BleuNFTAbi } from './abis/BleuNFTAbi';
import { ERC721Abi } from './abis/ERC721Abi';
import { OwnableAbi } from './abis/OwnableAbi';

const contractAddress = process.env.CONTRACT_ADDRESS;

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.ETH_RPC_URL),
      disableCache: true,
    },
  },
  contracts: {
    BleuNFT: {
      network: 'sepolia',
      abi: mergeAbis([ERC721Abi, OwnableAbi, BleuNFTAbi]),
      address: contractAddress as `0x${string}`,
    },
  },
});
