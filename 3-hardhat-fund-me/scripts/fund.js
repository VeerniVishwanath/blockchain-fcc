const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding Contract...")
    const transactionalResponse = await fundMe.fund(
        ethers.utils.parseEther("1")
    )
    transactionalResponse.wait(1)
    console.log("Funded!!")
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
