import Link from "next/link"
import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="p-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="items-center flex flex-row">
                <Link href="/" className="mr-4 p-6">
                    Home
                </Link>
                <Link href="/sell-nft" className="mr-4 p-6">
                    Sell Nft
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
