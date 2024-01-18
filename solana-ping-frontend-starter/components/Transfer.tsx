import { FC, useState } from "react"
import styles from '../styles/Home.module.css'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";

export const Transfer: FC = () => {
    const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();
    let amount = 0.5;
    let toAddress = "z5WDQkBaZRMgtXN85C2viZTPZK4MWvZyD6ZqWLgX5qx";

    const onClick = () => {
        console.log(`amount:${amount}, toAddress:${toAddress}`);

        if(!connection || !publicKey) {
			return;
		}

	    const transaction = new Transaction();
		const instruction = SystemProgram.transfer({
			fromPubkey: publicKey,
            toPubkey: new PublicKey(toAddress),
            lamports: 50000
		});

		transaction.add(instruction);
		sendTransaction(transaction, connection).then((sign) => {
			console.log(sign);
		})
    }


    return (
        <div>
            <label>Amount(in SOL) to Send:</label><br/>
            <input value={amount}/><br/>
            <label>Send SQL to:</label><br/>
            <input value={toAddress}/><br/>
            <button className={styles.button} onClick={onClick}>Ping!</button>
        </div>
    )
}