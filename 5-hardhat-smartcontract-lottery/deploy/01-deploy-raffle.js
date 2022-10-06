const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainName = network.name
    const chainId = network.config.chainId
    const VRF_SUB_FUND_AMOUNT = 30 //30 is overkill, 2 will do

    let vrfCoordinatorV2address
    let subscriptionId

    /**
     * @dev Checks and switches between localhost or testnet
     */
    if (developmentChains.includes(chainName)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2address = VRFCoordinatorV2Mock.address
        const txnResponse = await VRFCoordinatorV2Mock.createSubscription()
        const txnReceipt = await txnResponse.wait(1)
        subscriptionId = txnReceipt.events[0].args.subId
        //Fund the subscription
        //Usually you'd need the Link on a real network
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entraneFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGaslimit = networkConfig[chainId]["callbackGaslimit"]
    const interval = networkConfig[chainId]["interval"]

    /**
     * @notice Arguments for Raffle constructor
     */
    const args = [
        vrfCoordinatorV2address,
        entraneFee,
        gasLane,
        subscriptionId,
        callbackGaslimit,
        interval,
    ]

    /**
     * @dev Deploys the Raffle contract
     */
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfimations || 1,
    })

    if (!developmentChains.includes(chainName) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args)
    }
    log("--------------------------------------------------")
}

module.exports.tags = ["all", "raffle"]
