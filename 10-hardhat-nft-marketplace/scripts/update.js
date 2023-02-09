const { ethers } = require("hardhat")

async function update() {
    const PRICE = ethers.utils.parseEther("0.2")
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    const tokenId = 0
    
    console.log("Updating Listing....")
    const tx = await nftMarketplace.updateListing(basicNft.address, tokenId, PRICE)
    await tx.wait(1)
    console.log("Updated!")
}

update()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
