import { ethers } from "hardhat"

async function mint() {
    const basicNft = await ethers.getContract("BasicNft")

    console.log("Minting Nft....")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId

    console.log(`Nft Address is ${basicNft.address}`)
    console.log(`TokenId is ${tokenId}`)
}

mint()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
