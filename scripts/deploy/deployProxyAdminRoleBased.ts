import { ethers, network } from 'hardhat'
import { getDeployConfig, DeployableNetworks } from './deploy.config'
import { DeployManager } from './DeployManager'

/**
 * // NOTE: This is an example of the default hardhat deployment approach.
 * This project takes deployments one step further by assigning each deployment
 * its own task in ../tasks/ organized by date.
 */
async function main() {
  const currentNetwork = network.name as DeployableNetworks
  // Optionally pass in accounts to be able to use them in the deployConfig
  const accounts = await ethers.getSigners()
  const deployConfig = getDeployConfig(currentNetwork, accounts)
  const { ownerAddress, upgraderRoles } = deployConfig
  // Optionally pass in signer to deploy contracts
  const deployManager = new DeployManager(accounts[0])

  const contractName = 'ProxyAdminRoleBased'
  const ProxyAdmin = await ethers.getContractFactory(contractName)
  const proxyAdmin = await deployManager.deployContractFromFactory(
    ProxyAdmin,
    [upgraderRoles],
    contractName // Pass in contract name to log contract
  )

  await proxyAdmin.transferOwnership(ownerAddress)
  const proxyAdminOwner = await proxyAdmin.owner()

  await deployManager.verifyContracts()

  const output = {
    contractName,
    proxyAdmin: proxyAdmin.address,
    proxyAdminOwner,
    deployConfig,
  }

  console.dir(output, { depth: null })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
