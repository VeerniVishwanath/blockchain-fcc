const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Withdrawing")
    const transactionalResponse = await fundMe.withdraw()
    await transactionalResponse.wait(1)
    console.log(`Got it Back!!`)
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
