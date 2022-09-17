require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_RCP_URL = process.env.GOERLI_RCP_URL
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY

module.exports = {
    defaultNetwork: "hardhat",
    goerli: {
        url: GOERLI_RCP_URL,
        accounts: [GOERLI_PRIVATE_KEY],
    },
    solidity: "0.8.8",
}
