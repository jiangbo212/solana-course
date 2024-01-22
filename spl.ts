import * as web3 from "@solana/web3.js"
import "dotenv/config"
import * as token from "@solana/spl-token"
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

/**
 * 创建token工厂，需要消耗sol
 * @param connection 区块链连接
 * @param payer 交易付款方账户
 * @param mintAuthority 实际铸造代币的账户公钥 
 * @param freezeAuthority 可以冻结代币的账户公钥，可为null
 * @param decimals token的十进制进度(一般为2)
 * @returns 
 */
async function createMint(
  connection: web3.Connection,
  payer: web3.Keypair,
  mintAuthority: web3.PublicKey,
  freezeAuthority: web3.PublicKey,
  decimals: number
): Promise < web3.PublicKey > {
  const tokenMint = await token.createMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    decimals,
  );

  console.log(`Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`);

  return tokenMint;
}

/**
 * 创建代币账户，用于持有代币
 * @param connection 区块链连接
 * @param payer 创建付款者账户
 * @param mint 代币铸造工厂账户公钥
 * @param owner 代币账户持有者公钥
 * @returns 
 */
async function createTokenAccount(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
) {
  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner
  );

  console.log(`Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`);

  return tokenAccount;
}

/**
 * 制造代币
 * @param connection 区块链链接
 * @param payer 铸造付款方
 * @param mint 代币铸造工厂
 * @param destination  代币铸造目的地公钥
 * @param authority 代币权限所有者公钥
 * @param amount 铸造数量
 */
async function  mintTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  destination: web3.PublicKey,
  authority: web3.Keypair,
  amount: number
) {
  const transcationSignature = await token.mintTo(
    connection,
    payer,
    mint,
    destination,
    authority,
    amount
  );

  console.log(`Mint Token Transcation: https://explorer.solana.com/tx/${transcationSignature}?cluster=devnet`);
}

/**
 * 批准委托。有点类似于代理的意思。将源账户的部分代币委托给目标账户用于转移
 * @param connection 区块链链接
 * @param payer 交易付款方
 * @param account 源账户的公钥地址
 * @param delegate 目的账户的公钥地址
 * @param owner 源账户代币所有者的账户
 * @param amount 代表可以委托转让或销毁的最大代币数量
 */
async function approveDelegate(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  delegate: web3.PublicKey,
  owner: web3.Signer | web3.PublicKey,
  amount: number
) {
  const transcationSignature = await token.approve(
    connection,
    payer,
    account,
    delegate,
    owner,
    amount
  );

  console.log(`Approve Delegate Transcation: https://explorer.solana.com/tx/${transcationSignature}?cluster=devenet`);
}

/**
 * 代币转账
 * @param connection 区块链链接 
 * @param payer 交易付款方
 * @param source 源账户公钥地址
 * @param destination 目的账户公钥地址 
 * @param owner 代币持有者公钥账户
 * @param amount 转账金额
 */
async function transferTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.transfer(
    connection,
    payer,
    source,
    destination,
    owner,
    amount
  );
   console.log(`Transfer Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`);
}

/**
 * 撤销委托
 * @param connection 区块链链接
 * @param payer 交易付款方
 * @param account token持有账户
 * @param owner token持有者公钥
 */
async function revokeDelegate(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  owner: web3.Signer | web3.PublicKey
) {
  const transactionSignature = await token.revoke(
    connection,
    payer,
    account,
    owner
  )

  console.log(`Revote Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`)
}

/**
 * 销毁token
 * @param connection 区块链 
 * @param payer 交易付款方
 * @param account token持有账户
 * @param mint token铸造工厂
 * @param owner token所属者
 * @param amount 销毁数量
 */
async function burnTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  mint: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.burn(
    connection,
    payer,
    account,
    mint,
    owner,
    amount
  );

  console.log(`Burn Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`);

}

async function main() {
  const connection = new web3.Connection("https://devnet.helius-rpc.com/?api-key=a7e75b09-e795-44f2-8a1d-dbb60d156a05", "confirmed");
  // const user = await initializeKeypair(connection)
  const user = getKeypairFromEnvironment("SECRET_KEY");
  const mint = await createMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    2 
  );
  const mintInfo = await token.getMint(connection, mint);

  const tokenAccount = await createTokenAccount(
    connection,
    user,
    mint,
    user.publicKey
  );

  await mintTokens(
    connection,
    user,
    mint,
    tokenAccount.address,
    user,
    100 * 10 ** mintInfo.decimals
  )

  // const delegate_publickey = process.env.RECEIVE_PUBLIC_KEY || '';
  const delegate = web3.Keypair.generate();
  console.log(`Token Deletegate PublicKey:${delegate.publicKey}`);

  await approveDelegate(
    connection,
    user,
    tokenAccount.address,
    delegate.publicKey,
    user,
    50 * 10 ** mintInfo.decimals,
  )

  const receive_publickey = new web3.PublicKey(process.env.RECEIVE_PUBLIC_KEY || '');
  
  // 创建接收方token 账户
  const receiveTokenAccount = await createTokenAccount(
    connection,
    user,
    mint,
    receive_publickey
  );

  // 从委托方转账50到receive
  await transferTokens(
    connection,
    user,
    tokenAccount.address,
    receiveTokenAccount.address,
    delegate,
    50 * 10 ** mintInfo.decimals
  );

  // 撤销委托
  await revokeDelegate(
    connection,
    user,
    tokenAccount.address,
    user
  )

  await burnTokens(
    connection,
    user,
    tokenAccount.address,
    mint,
    user,
    25 * 10 ** mintInfo.decimals
  )

}

main()
  .then(() => {
    console.log("Finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })

