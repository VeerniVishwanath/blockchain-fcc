import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <div className="bg-[#497174] font-serif " style={{ color: "white" }}>
            <nav className="h-16 p-5 border-b-2 flex flex-row justify-between items-center ">
                <h1 className="p-4 font-bold text-3xl ">Nft Marketplace</h1>
                <div className="flex flex-row items-center">
                    <Link href="/">
                        <a className="mr-4 p-6">Home</a>
                    </Link>
                    <Link href="/sell-nft">
                        <a className="mr-4 p-6">Sell NFT</a>
                    </Link>
                    <Link href="/my-nft">
                        <a className="mr-4 p-6">My NFT</a>
                    </Link>

                    <ConnectButton moralisAuth={false} />
                </div>
            </nav>
        </div>
    )
}
