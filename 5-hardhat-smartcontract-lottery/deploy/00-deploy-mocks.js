const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25")
const GAS_PRICE_LINK = 1e9
const args = [BASE_FEE, GAS_PRICE_LINK]

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainName = network.name

    /**
     * @dev If on development network then deploys Mocks for VRFCoordinator
     */
    if (developmentChains.includes(chainName)) {
        log("Development Chain detected!! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args,
            log: true,
        })
        log("Deployed Mocks!")
        log("--------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
