import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

export const EASContractAddress = '0x4200000000000000000000000000000000000021'; // Optimism Sepolia

const eas = new EAS(EASContractAddress);

const provider = ethers.getDefaultProvider('sepolia');

eas.connect(provider);