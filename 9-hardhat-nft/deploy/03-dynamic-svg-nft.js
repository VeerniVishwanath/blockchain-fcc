const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments, network, ethers }) => {
    const { deployer } = await getNamedAccounts()
    const { log, deploy } = deployments

    const chainId = network.config.chainId
    const chainName = network.name

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(chainName)) {
        const MockV3Aggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = MockV3Aggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const lowSvg = fs.readFileSync("./images/dynamicNft/frown.svg", { encoding: "utf8" })
    const highSvg = fs.readFileSync("./images/dynamicNft/happy.svg", { encoding: "utf8" })

    const args = [ethUsdPriceFeedAddress, lowSvg, highSvg]

    const dynamicSvgNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log(`Verifying....`)
        await verify(basicNft.address, args)
    }
    log(`-----------------------------------------`)
}

module.exports.tags = ["all", "dynamicsvg", "main"]
