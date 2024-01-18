import "dotenv/config"
import {getKeypairFromEnvironment} from "@solana-developers/node-helpers"

// public_key: z5WDQkBaZRMgtXN85C2viZTPZK4MWvZyD6ZqWLgX5qx
// secret_key: [ 96, 210, 145, 117, 103, 112, 108,   2, 115, 174, 197, 240, 186,   9,  70,  91, 240,  11,  90,  40, 239, 214, 72,  67, 157, 234, 132,  36, 249,  51,  29, 183,  14,  159,  50, 205, 234, 120,  73, 196, 136,  13, 157,  87, 148,   6, 133, 114,  46, 105, 122,  19, 134, 120,  88,  171,  80,  73, 212, 141, 177,  16, 135, 231]


// import { Keypair } from "@solana/web3.js";

// const keypair = Keypair.generate();

// console.log(`The public key is:`, keypair.publicKey.toBase58());
// console.log(`The secret key is:`, keypair.secretKey);

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`Finished! We've loaded our secret key securely, using an env file~\n`, keypair.publicKey.toBase58());