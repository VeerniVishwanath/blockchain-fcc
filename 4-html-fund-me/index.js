import { ethers } from "./ethers-5.2.esm.min.js"
import { contractAddress, abi } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectButton.innerHTML = "Connected!!"
        } catch (err) {
            console.log(err)
        }
    } else {
        connectButton.innerHTML = "Please install MetaMask!!"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
        balanceButton.innerHTML = ethers.utils.formatEther(balance)
    }
}

async function fund() {
    const ethAmount = document.getElementById("EthAmount").value
    if (typeof window.ethereum !== "undefined" && ethAmount != "") {
        console.log(`Funding with ${ethAmount}..`)
        //provider / connection to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        //signer / wallet / someone with gas
        const signer = provider.getSigner()
        //contract
        //^ ABI, Address
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(txResponse, provider)
            console.log("Done!!")
        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }
}

function listenForTransactionMine(txResponse, provider) {
    console.log(`Mining: ${txResponse.hash}....`)
    //listen for the transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `Completed with ${txReceipt.confirmations} Confirmations`
            )
            resolve()
        })
    })
}
