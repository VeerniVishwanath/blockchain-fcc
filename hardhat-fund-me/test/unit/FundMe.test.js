const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async () => {
    let fundMe
    let deployer
    let mockV3Aggregator
    // let sendValue = "1000000000000000000"
    let sendValue = ethers.utils.parseEther("1")

    beforeEach(async () => {
        /**Deploy our fundMe contract
         * using hardhat
         */
        // const accounts = await ethers.getSigners() //Gets all accounts in hardhat.config
        // const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture("all")
        fundMe = await ethers.getContract("FundMe", deployer) //we can pass accountZero instead
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
    })

    describe("constructor", async () => {
        it("sets the aggregator address correctly", async () => {
            const response = await fundMe.getPriceFeed()
            //This checks if we're correctly signing
            //priceFeed Address to mockV3Aggregator
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
            //This checks if you sent enough ETH and to.be.revertedWith()
            // checks for the same revert error in .sol
            await expect(fundMe.fund()).to.be.revertedWith("Didn't send enough")
        })

        it("updated the amount funded data structure", async () => {
            //This checks if the amount sent
            //gets added in the HashMap
            await fundMe.fund({ value: sendValue })
            let response = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })

        it("Add funders to funders Array", async () => {
            //Checks if the funder is added to the funders array[]
            await fundMe.fund({ value: sendValue })
            let response = await fundMe.getFunder(0)
            assert.equal(response, deployer)
        })
    })

    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw ETH from a single funder", async () => {
            //Arrange
            //Starting balance of Contract & deployer
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            //Act
            const transactionalResponse = await fundMe.withdraw()
            const transactionalReciept = await transactionalResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionalReciept
            const gasCost = effectiveGasPrice.mul(gasUsed)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        } )

        it("cheaperWithdraw ETH from a single funder", async () => {
            //Arrange
            //Starting balance of Contract & deployer
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            //Act
            const transactionalResponse = await fundMe.cheaperWithdraw()
            const transactionalReciept = await transactionalResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionalReciept
            const gasCost = effectiveGasPrice.mul(gasUsed)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
        
        it( "withdraw with multiple funders", async () => {
            //Arrange
            const accounts = await ethers.getSigners()
            for ( let i = 1; i < 6; i++ ){
                const fundMeConnectedContract = await fundMe.connect( accounts[i] )
                await fundMeConnectedContract.fund({value:sendValue})
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //Act 
            const transactionalResponse = await fundMe.withdraw()
            const transactionalReciept = await transactionalResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionalReciept
            const gasCost = effectiveGasPrice.mul(gasUsed)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )

            //make sure the funders are reset properly
            await expect( fundMe.getFunder( 0 ) ).to.be.reverted
            
            for ( let i = 0; i < 6; i++ ){
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
            } 
        } )

        it("cheaper Withdraw", async () => {
            //Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //Act
            const transactionalResponse = await fundMe.cheaperWithdraw()
            const transactionalReciept = await transactionalResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionalReciept
            const gasCost = effectiveGasPrice.mul(gasUsed)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )

            //make sure the funders are reset properly
            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let i = 0; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                )
            }
        })
        
        it( "Only allows owner to withdraw", async () => {
            const accounts = await ethers.getSigners()
            const attackerConnectedContract =await fundMe.connect(accounts[1])
            
            await expect(
                attackerConnectedContract.withdraw()
            ).to.be.revertedWithCustomError(fundMe,"FundMe__NotOwner")
        })
    })
})
