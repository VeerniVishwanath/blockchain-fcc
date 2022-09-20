const { network } = require("hardhat")
const {
    developmentChains,
    DECIMAL,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainName = network.name

    if (developmentChains.includes(chainName)) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMAL, INITIAL_ANSWER],
        })
        log("Mocks deployed!")
        log("-----------------------------------------")
    }
}

//to only run our mock script we use tags
module.exports.tags = ["all", "mocks"]
