const { assert, expect } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", () => {
    let simpleStorageFactory, simpleStorage

    beforeEach(async () => {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with Favorite Number 0", async () => {
        const currentNumber = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(currentNumber.toString(), expectedValue)
    })

    it("Should return updated value as 69", async () => {
        const expectedValue = "69"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)

        const updatedValue = await simpleStorage.retrieve()

        assert.equal(updatedValue.toString(), expectedValue)
    })

    it( "Should display name and favoriteNumber in the array respectively",async () => {
        const name = "Marcus Brutus"
        const favoriteNumber = "23"

        const transactionResponse = await simpleStorage.add( name, favoriteNumber )
        await transactionResponse.wait( 1 )
        
        const [numberValue, nameValue] = await simpleStorage.retrieveNameNumber(0)

        assert.equal( name, nameValue )
        assert.equal(favoriteNumber, numberValue.toString())
    })
})
