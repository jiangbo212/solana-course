import "dotenv/config";
import {getKeypairFromEnvironment} from "@solana-developers/node-helpers"
import { Connection, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";

const payer = getKeypairFromEnvironment("SECRET_KEY");
const connection = new Connection(process.env.RPC_URL || '', "confirmed");

const PING_PROGRAM_ADDRESS = new PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa");
const PING_PROGRAM_DATA_ADDRESS = new PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod");

const transaction = new Transaction();
const program_id = new PublicKey(PING_PROGRAM_ADDRESS);
const program_data_id = new PublicKey(PING_PROGRAM_DATA_ADDRESS);

const instruction = new TransactionInstruction({
    keys: [{
        pubkey: program_data_id,
        isSigner: false,
        isWritable: true
    }],
    programId: program_id
});

transaction.add(instruction);

const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
);

console.log(`Transaction completed! Signature is ${signature}`);