const { config } = require("dotenv")
const { network } = require("hardhat")
const { INITIAL_SUPPLY, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("-------------------------------------------------")
    log("Deploying...")

    const ourToken = await deploy("OurToken", {
        from: deployer,
        args: [INITIAL_SUPPLY],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`OurToken deployed at ${ourToken.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(ourToken.address, [INITIAL_SUPPLY])
    }
    log("-------------------------------------------------")
}

module.exports.tags = ["all", "ourToken"]
