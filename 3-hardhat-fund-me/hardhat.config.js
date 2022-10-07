const { version } = require("chai")

require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_RCP_URL =
    process.env.GOERLI_RCP_URL || "http://etherscan.com/RCP_URL"
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY || "Key"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Key"
// const CONINMARKETCAP_API_KEY = process.env.CONINMARKETCAP_API_KEY || "Key"

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RCP_URL,
            accounts: [GOERLI_PRIVATE_KEY],
            chainid: 420,
            blockConfirmations: 6,
        },
        localhost: {
            //use hardhat node
            url: "http://127.0.0.1:8545/",
            //accounts : Thanks HardHat!,
            chainid: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    // solidity: "0.8.8",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-reporter.txt",
        noColors: true,
        currency: "USD",
        // coinmarketcap: CONINMARKETCAP_API_KEY,
        // token: "MATIC",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
}
