const { ethers } = require("hardhat")

async function mintAndList() {
    const PRICE = ethers.utils.parseEther("0.1")
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")

    console.log("Minting Nft....")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = await mintTxReceipt.events[0].args.tokenId

    console.log("Approving contract....")
    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approvalTx.wait(1)

    console.log("Listing Nft....")
    const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
    await tx.wait(1)
    console.log("Listed!")
}

mintAndList()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })

 