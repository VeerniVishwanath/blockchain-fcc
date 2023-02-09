import { useMoralis, useWeb3Contract } from "react-moralis"
import marketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Button, useNotification } from "web3uikit"
import { GET_BOUGHT_ITEMS } from "../constants/subgraphQueries"
import NFTBox2 from "../components/NFTBox"
import { useQuery } from "@apollo/client"

export default function myNft() {
    const [proceeds, setProceeds] = useState("")
    const [checkBalClicked, setCheckBalClicked] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(false)

    const { account, chainId, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()

    // To get the available proceeds Balance
    const { runContractFunction: getProceeds } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getProceeds",
        params: { seller: account },
    })

    async function checkProceeds() {
        const bal = await getProceeds()
        if (bal) {
            const balance = ethers.utils.formatUnits(bal, "ether")
            setProceeds(balance)
            console.log(balance)
        }
    }

    //To withdraw available proceeds
    const withdrawOptions = {
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "withdrawProceeds",
    }

    //Get Items Bought NFT Details
    const { loading, error, data: listedNfts } = useQuery(GET_BOUGHT_ITEMS)

    return (
        <div className="container mx-auto p-5">
            <div className="p-4 font-bold text-2xl text-center font-serif text-[#5c6267] ">
                My NFT's
            </div>
            <div className="text-3xl ml-10 mb-5 font-mono font-medium flex flex-col items-end">
                {!checkBalClicked ? (
                    <Button
                        onClick={() => {
                            checkProceeds()
                            setCheckBalClicked(true)
                            proceeds > 0 ? setButtonDisable(true) : setButtonDisable(false)
                        }}
                        text="Check Balance"
                    />
                ) : (
                    <div className="flex flex-row ">
                        <div className="text-[#5c6267] font-serif font-semibold">
                            Available Proceeds: {proceeds} ETH
                        </div>
                        <div className="mt-10">
                            {proceeds > 0 ? (
                                <Button
                                    text="Withdraw"
                                    disabled={buttonDisable}
                                    onClick={async () => {
                                        await runContractFunction({
                                            params: withdrawOptions,
                                            onError: (error) => {
                                                console.log(error)
                                            },
                                            onSuccess: async (tx) => {
                                                await tx.wait(1)
                                                window.location.reload()
                                                dispatch({
                                                    title: "Withdraw Status",
                                                    message: "Withdraw Successful",
                                                    type: "success",
                                                    position: "topR",
                                                })
                                            },
                                        })
                                    }}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="container mx-auto">
                {isWeb3Enabled ? (
                    <div className="flex flex-wrap">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            listedNfts.itemBoughts.map((nft) => {
                                const { id, buyer, nftAddress, tokenId, price } = nft

                                return (
                                    <NFTBox2
                                        nftAddress={nftAddress}
                                        buyer={buyer}
                                        tokenId={tokenId}
                                        key={`${nftAddress}${tokenId}`}
                                        price={price}
                                    />
                                )
                            })
                        )}
                    </div>
                ) : (
                    <h1>Please connect your wallet</h1>
                )}
            </div>
        </div>
    )
}
