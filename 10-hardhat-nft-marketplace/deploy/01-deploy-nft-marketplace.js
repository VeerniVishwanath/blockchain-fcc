const { VERIFICATION_BLOCK_CONFIRMATIONS, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments, network, ethers }) => {
    const { deployer } = await getNamedAccounts()
    const { log, deploy } = deployments

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log(`----------------------------------------------------`)

    const args = []

    const nftMarketplace =await deploy("NftMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    //Verifying the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log(`Verifying`)
        await verify(nftMarketplace.address, args)
    }

    log(`----------------------------------------------------`)
}

module.exports.tags = ["all", "nftmarketplace"]
