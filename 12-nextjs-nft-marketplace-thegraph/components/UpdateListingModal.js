import { Card, Input, Modal, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"
import { useState } from "react"
import Image from "next/image"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    price,
    isVisible,
    onClose,
    marketplaceAddress,
    imageURI,
}) {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("")

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
            tokenId: tokenId,
        },
    })

    // To Display Notification on successfull transaction
    const dispatch = useNotification()
    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing Updated",
            title: "Listing updated - please refresh",
            position: "topR",
        })
        onClose()
        setPriceToUpdateListingWith("")
    }

    return (
        <Modal
            isVisible={isVisible}
            title="Update Listing"
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                if (priceToUpdateListingWith > 0) {
                    updateListing({
                        onError: (error) => {
                            console.log(error)
                        },
                        onSuccess: handleUpdateListingSuccess,
                    })
                }
            }}
        >
            <div className="top-[2px]">#{tokenId}</div>
            <Image loader={() => imageURI} src={imageURI} height="200" width="200" />
            <div className="font-bold mb-6">
                {ethers.utils.formatUnits(price, "ether")} ETH
            </div>
            <div className="flex justify-center">
                <Input
                    label="Update price in L2 currency (ETH)"
                    name="Update Listing "
                    type="number"
                    validation={{
                        required: true,
                    }}
                    onChange={(event) => {
                        setPriceToUpdateListingWith(event.target.value)
                    }}
                    value={priceToUpdateListingWith}
                />
            </div>
        </Modal>
    )
}
