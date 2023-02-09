import Image from "next/image"
import Header from "../components/Header"
import styles from "../styles/Home.module.css"
import { GET_ACTIVE_ITEMS } from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import NFTBox from "../components/NFTBox"
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"

export default function Home() {
    const { data: listedNfts, loading, error } = useQuery(GET_ACTIVE_ITEMS)
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    return (
        <div className="container mx-auto">
            <h1 className="p-4 font-bold text-2xl text-center font-serif text-[#5c6267]">
                Gallery
            </h1>
            {isWeb3Enabled ? (
                <div className="flex flex-wrap">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            {
                                /* console.log(nft) */
                            }
                            const { id, seller, nftAddress, tokenId, price } = nft

                            return (
                                <NFTBox
                                    seller={seller}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    price={price}
                                    marketplaceAddress={marketplaceAddress}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )}
                </div>
            ) : (
                <div>Please Connect your Wallet...</div>
            )}
        </div>
    )
}
