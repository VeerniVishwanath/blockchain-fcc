const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const imageLocations = "./images/randomNft"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100,
        },
    ],
}

let tokenURIs = [
    "ipfs://QmafBLn3aEhTeyNdcyTtznj75pedrhUp2jDJBC8sRNCGin",
    "ipfs://QmZ28hcHp78ERFiZf3xHcDRLaWowVUqXgwnfiRRtDKd4sH",
    "ipfs://QmNYqhjDc46V8GZUrvk4Lxyf79RLfiyJQ5wriTkfDGFbRG",
]

const FUND_AMOUNT = "1000000000000000000000"

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorV2Address, subscriptionId

    // get the ipfs hash of our images
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenURIs = await handleTokenUris()
    }

    if (developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReciept = await tx.wait()
        subscriptionId = txReciept.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log(`------------------------------------`)
    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        tokenURIs,
        networkConfig[chainId].mintFee,
    ]

    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`------------------------------------`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log(`Verifying....`)
        await verify(randomIpfsNft.address, args)
    } else {
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address)
        console.log(`Consumer Added`)
    }
    log(`-----------------------------------------`)
}

async function handleTokenUris() {
    tokenURIs = []

    //Store the image in ipfs
    //Store the metaData in ipfs
    const { responses: imageUploadResponses, files } = await storeImages(imageLocations)
    for (imageUploadResponseIndex in imageUploadResponses) {
        //create Metadata
        //upload Metadata
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup `
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenURIs.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log(`Token URIs Uploaded! They are:`)
    console.log(tokenURIs)
    return tokenURIs
}

module.exports.tags = ["all", "randomNft", "main"]
