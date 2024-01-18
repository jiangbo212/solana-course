import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import "dotenv/config"

const public_key = process.env.PUBLIC_KEY || '';
const rpc_url = process.env.RPC_URL || '';

console.log(public_key);

const connection = new Connection(rpc_url, "confirmed");

const balanceInLamports = await connection.getBalance(new PublicKey(public_key));

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(`Finished! The balance for the wallet at address ${process.env.PUBLIC_KEY} is ${balanceInSOL}`)