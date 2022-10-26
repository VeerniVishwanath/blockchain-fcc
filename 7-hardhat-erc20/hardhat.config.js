require("hardhat-deploy")
require("dotenv").config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        localhost: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
            blockConfirmations: 6,
        },
    },
    solidity: {
        compilers: [{ version: "0.8.7" }],
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        user1: {
            default: 1,
        },
    },
}
