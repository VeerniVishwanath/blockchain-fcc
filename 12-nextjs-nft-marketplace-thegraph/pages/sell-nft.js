import { useState } from "react"
import Head from "next/head"
import Image from "next/image"
import { Form, useNotification } from "web3uikit"
import styles from "../styles/Home.module.css"
import marketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import networkMapping from "../constants/networkMapping.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"

export default function Home() {
    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onError: (error) => {
                console.log(error)
                dispatch({
                    type: "error",
                    message: "Please refresh and try again",
                    title: "Something went wrong",
                    position: "topR",
                })
            },
            onSuccess: () => {
                handleApproveSuccess(nftAddress, tokenId, price)
            },
        })
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Ok! Now Time to list")
        const listOptions = {
            abi: marketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error) => {
                console.log(error)
                dispatch({
                    type: "error",
                    message: "Please refresh and try again",
                    title: "Something went wrong",
                    position: "topR",
                })
            },
        })
    }

    async function handleListSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "NFT listed successfully",
            title: "NFT Listed",
            position: "topR",
        })
    }
    return (
        <div className="flex h-screen ">
            <div class="m-auto mt-20">
                <Form
                    data={[
                        {
                            inputWidth: "50%",
                            name: "NFT Address",
                            type: "text",
                            value: "",
                            key: "nftAddress",
                            validation: {
                                required: true,
                            },
                        },
                        {
                            inputWidth: "25%",
                            name: "Token Id",
                            type: "number",
                            value: "",
                            key: "tokenId",
                            validation: {
                                required: true,
                            },
                        },
                        {
                            inputWidth: "25%",
                            name: "Price",
                            type: "number",
                            value: "",
                            key: "price",
                            validation: {
                                required: true,
                            },
                        },
                    ]}
                    title="Sell your NFT!"
                    id="Main form"
                    onSubmit={approveAndList}
                />
            </div>
        </div>
    )
}
