import Head from "next/head"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import "../styles/globals.css"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { NotificationProvider } from "web3uikit"
import { useEffect } from "react"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/41264/nft-marketplace/0.0.3",
})

export default function MyApp({ Component, pageProps }) {
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("chainChanged", () => {
                window.location.reload()
            })
            window.ethereum.on("accountsChanged", () => {
                window.location.reload()
            })
        }
    })

    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="Nft Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}
