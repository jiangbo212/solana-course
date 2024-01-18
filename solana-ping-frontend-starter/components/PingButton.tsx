import { FC, useState } from 'react'
import styles from '../styles/PingButton.module.css'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

export const PingButton: FC = () => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();
	const onClick = () => {
		if(!connection || !publicKey) {
			return;
		}

		const programId = new PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa");
		const programDataAccount = new PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod");
		const transaction = new Transaction();
		const instruction = new TransactionInstruction({
			keys: [{
				pubkey: programDataAccount,
				isSigner: false,
				isWritable: true,
			}],
			programId
		});
		transaction.add(instruction);
		sendTransaction(transaction, connection).then((sign) => {
			console.log(sign);
		})
	}

	return (
		<div className={styles.buttonContainer} onClick={onClick}>
			<button className={styles.button}>Ping!</button>
		</div>
	)
}

