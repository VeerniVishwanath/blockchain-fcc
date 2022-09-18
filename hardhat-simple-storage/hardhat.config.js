require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("solidity-coverage")

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
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            //accounts : Thanks HardHat!,
            chainid: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    solidity: "0.8.8",
    gasReporter: {
        enabled: true,
        outputFile: "gas-reporter.txt",
        noColors: true,
        // currency: "USD",
        // coinmarketcap: CONINMARKETCAP_API_KEY,
        // token: "MATIC",
    },
}
