/**Imports */
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const {
        chainId: chainIdHex,
        isWeb3Enabled,
        isLoading,
        isFetching,
    } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress =
        chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()

    /** Use State Variables */
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0x")

    /** Contract Functions */
    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    /** Use Effect Variables */
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        updateUI()
        handleNewNotification()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            title: "Tx Notification",
            message: "Transaction Complete!",
            position: "topR",
            icon: "bell",
        })
    }

    /** Return Function */
    return (
        <div className="p-5">
            <div className="pb-5">Hi from LotteryEntrance </div>
            {raffleAddress ? (
                <div className="pb-2        ">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 py-1 px-2 text-white font-bold rounded ml-auto"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (e) => {
                                    console.log(
                                        `Error with EnterRaffle Button: `
                                    )
                                    console.log(e)
                                },
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 "></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                </div>
            ) : (
                <></>
            )}
            <div>
                Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}
                ETH
            </div>
            <div>
                Number Of Players: {numPlayers} <br />
            </div>
            <div>Recent Winner: {recentWinner}</div>
        </div>
    )
}
