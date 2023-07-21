import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Networks } from '../../hardhat'

/**
 * Get the deploy config for a given network
 * @param network
 * @param signers Optional signers to extract addresses from
 * @returns
 */
export const getDeployConfig = (network: DeployableNetworks, signers?: SignerWithAddress[]): DeploymentVariables => {
  const config = deployableNetworkConfig[network]
  if (!config) {
    throw new Error(`No deploy config for network ${network}`)
  }
  return config(signers)
}

/**
 * Extract networks as deployments are needed
 *
 * NOTE: Add networks as needed
 */
export type DeployableNetworks = Extract<Networks, 'bsc' | 'polygon' | 'arbitrum'>

/**
 * Deployment Variables for each network
 *
 * NOTE: Update variables as needed
 */
interface DeploymentVariables {
  // proxyAdminAddress: string
  // wNative: string
  ownerAddress: string
  upgraderRoles: string[]
}

// NOTE: These are intended for a view only price getter contract
const deployableNetworkConfig: Record<DeployableNetworks, (signers?: SignerWithAddress[]) => DeploymentVariables> = {
  bsc: (signers?: SignerWithAddress[]) => {
    return {
      ownerAddress: '0x50Cf6cdE8f63316b2BD6AACd0F5581aEf5dD235D', // BSC General Admin GSafe
      upgraderRoles: [
        '0xb5FF1896Fbc20CA130cE4736878aac01CA852b29', // Timelock Executor (Insecure) BSC GSafe
        '0x73798EBdEC73d902fB3aD80Be71ef40dBdd99eBb', // Tastic [EOA]
        '0x6c905b4108A87499CEd1E0498721F2B831c6Ab13', // General Admin [EOA]
        '0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2', // Doublo
      ],
      // proxyAdminAddress: '0x',
      // wNative: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    }
  },
  polygon: (signers?: SignerWithAddress[]) => {
    return {
      ownerAddress: '0x2c5fd64a3e27826caf1a3d0f1be6f8ed9f8a4f8a', // Polygon General Admin GSafe
      upgraderRoles: [
        '0x73798EBdEC73d902fB3aD80Be71ef40dBdd99eBb', // Tastic [EOA]
        '0x6c905b4108A87499CEd1E0498721F2B831c6Ab13', // General Admin [EOA]
        '0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2', // Doublo
      ],
      // proxyAdminAddress: '0x',
      // wNative: '',
    }
  },
  arbitrum: (signers?: SignerWithAddress[]) => {
    return {
      ownerAddress: '0x8Ad7E08f1c7d4e37574e7Fe4478C174AbcAc4B61', // Arbitrum General Admin GSafe
      upgraderRoles: [
        '0x73798EBdEC73d902fB3aD80Be71ef40dBdd99eBb', // Tastic [EOA]
        '0x6c905b4108A87499CEd1E0498721F2B831c6Ab13', // General Admin [EOA]
        '0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2', // Doublo
      ],
      // proxyAdminAddress: '0x',
      // wNative: '',
      // address: signers?.[0].address || '0x',
    }
  },
}
