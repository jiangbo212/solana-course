import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Connection } from "@solana/web3.js";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { FC, ReactNode } from "react";
require("@solana/wallet-adapter-react-ui/styles.css")

const WalletContextProvider: FC<{children:ReactNode}> = ({children}) => {
    // const endpoint = new Connection("https://rpc.ankr.com/solana_devnet", "confirmed").rpcEndpoint;
    const endpoint = "https://rpc.ankr.com/solana_devnet";
    const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;
