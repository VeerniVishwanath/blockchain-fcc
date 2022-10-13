const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2") //30 is overkill, 2 will do

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainName = network.name
    const chainId = network.config.chainId

    let vrfCoordinatorV2address, VRFCoordinatorV2Mock
    let subscriptionId

    /**
     * @dev Checks and switches between localhost or testnet
     */
    if (developmentChains.includes(chainName)) {
        VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
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

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : network.config.blockConfimations

    log("----------------------------------------------------")
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
        waitConfirmations: waitBlockConfirmations,
    })

    // we have to add the Raffle contract's address to VRFCoordinatorV2Mock's consumers
    if (chainId == 31337) {
        await VRFCoordinatorV2Mock.addConsumer(subscriptionId.toNumber(), raffle.address)
    }

    if (!developmentChains.includes(chainName) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args)
    }
    log("--------------------------------------------------")
}

module.exports.tags = ["all", "raffle"]
