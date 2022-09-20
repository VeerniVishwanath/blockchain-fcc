const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainid

    let priceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        priceFeedAddress = ethUsdAggregator.address
    } else {
        // using helper-hardhat-config.js to dynamically select chain address
        priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [priceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(
            network.name && process.env.ETHERSCAN_API_KEY
        )
    ) {
        await verify(fundMe.address, args)
    }
    log("-----------------------------------------")
    //when going for localhost or hardhat network we want to use mocks
}

module.exports.tags = ["all", "fundme"]
