import { format } from "prettier"
import { useEffect, useState } from "react"
import { useMoralis } from "react-moralis"

export default function ManualHeader() {
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis()

    const [isConnected, setConnected] = useState(true)

    useEffect(() => {
        if (isWeb3Enabled) return
        console.log(`Not Connected`)
        if (typeof window != "undefined") {
            window.localStorage.getItem("connected")
            enableWeb3()
        }
        console.log("Hie")
        console.log(isWeb3Enabled)
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account == null) {
                console.log(`Account disconnected`)

                if (typeof window != "undefined")
                    window.localStorage.removeItem("connected")

                deactivateWeb3()
                console.log(`Null Account Found`)
            } else {
                console.log(`Account changed to ${account}`)
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}....
                    {account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window != "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    OnClick
                </button>
            )}
        </div>
    )
}
