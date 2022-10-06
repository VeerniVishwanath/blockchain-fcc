const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verifying..")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.toLowerCase().includes("already verified")) {
            console.log("Already Verified!!")
        } else {
            console.log("Error --->" + error)
        }
    }
}

module.exports = {verify}