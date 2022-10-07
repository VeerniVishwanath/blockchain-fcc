const { assert } = require("chai")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
/**We run this right before deploying onto the testnet/mainnet
 * This is the Last step in development
 */
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundeMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("allows people to fund and withdraw", async () => {
              await fundeMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(
                  fundeMe.address
              )
              assert(endingBalance.toString(), "0")
          })
      })
