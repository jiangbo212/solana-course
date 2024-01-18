import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import { Connection, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";

const receive_public_key = process.argv[2] || null;

if (!receive_public_key) {
    console.log(`Please provide a public key to send to`);
    process.exit(1);
}

const sender_key_pair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`sender_public_key:${sender_key_pair.publicKey}`)
console.log(`receive_public_key:${receive_public_key}`)


const to_public_key = new PublicKey(receive_public_key);

const connection = new Connection(process.env.RPC_URL || '', 'confirmed');

console.log(`Loaded our own keypair, the destination public key, and connected to Solana`);

const transaction = new Transaction();

const LAMPORTS_TO_SEND = 50000;

const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: sender_key_pair.publicKey,
    toPubkey: to_public_key,
    lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signatrue = await sendAndConfirmTransaction(connection, transaction, [sender_key_pair]);

console.log(`Finished! Sent ${LAMPORTS_TO_SEND} to the address ${to_public_key}`);

console.log(`Translation signature is ${signatrue}!`);