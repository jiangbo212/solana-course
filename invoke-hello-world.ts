import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import { Connection, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js"
import "dotenv/config"

const transaction = new Transaction();
const program_id = new PublicKey(process.env.HELLO_WORLD_ADDRESS || '');

const instruction = new TransactionInstruction({
    keys:[],
    programId: program_id
});

transaction.add(instruction);

const payer = getKeypairFromEnvironment("SECRET_KEY");
const connection = new Connection(process.env.RPC_URL || '', "confirmed");

const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
);

console.log(`Invoke Hello-World Success! https://explorer.solana.com/tx/${signature}?cluster=devnet`)