const { ethers, run, network } = require("hardhat")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )

    console.log("Deploying contract...")
    const SimpleStorage = await SimpleStorageFactory.deploy()
    await SimpleStorage.deployed()

    console.log(`Contract Address: ${SimpleStorage.address}`)

    if (network.config.chainid == 420 && process.env.ETHERSCAN_API_KEY) {
        console.log(`Waiting for BLock Confirmations...`);
        await SimpleStorage.deployTransaction.wait( 6 )
        await verify(SimpleStorage.address, [])
    }

    //Retrieve StoredNumber
    const currentNumber = await SimpleStorage.retrieve();
    console.log(`Current Number: ${currentNumber}`);
    
    //Updating Current Number
    const transactionResponse = await SimpleStorage.store( 79 )
    await transactionResponse.wait( 1 )
    
    const updatedValue = await SimpleStorage.retrieve();
    console.log(`Updated Value: ${updatedValue}`);
}

async function verify(contractAddress, args) {
    console.log(`Verifying contract...`)
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if ( error.message.toLowerCase().includes( "already verified" ) ) {
            console.log(`Already Verified!`)
        } else {
            console.log(`Error: ${error}`)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => process.exit(1))
