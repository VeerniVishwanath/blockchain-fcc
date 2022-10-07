const { run, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config.js")

const verify = async (contractAddress, args) => {
    if (!developmentChains.includes(network.name)) {
        console.log("Verifying contracts...")
        try {
            await run("verify:verify", {
                address: contractAddress,
                constructorArguments: args,
            })
        } catch (error) {
            if (error.message.toLowerCase().includes("already verified")) {
                console.log("Already Verified!!!")
            } else {
                console.log(`Error :${error}`)
            }
        }
    }
}

module.exports = { verify }
