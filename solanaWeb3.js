const web3 = require('@solana/web3.js')
const splToken = require('@solana/spl-token')
const id = require('./id.json')

async function run (receivers) {
    const tokenPublicKey = new web3.PublicKey('DvAwjY6rbztp7wgAQzZA4NPdGZT3w96SxXmDKd7pMF3s')
    const connection = new web3.Connection(web3.clusterApiUrl('testnet'), 'confirmed')
    const fromWallet = new web3.Account(id)
    const toWallet = new web3.PublicKey('7xUiQSXbqApyTtJ3tciavYY5yubiBC9honkSbn3ADTfS')

    // request airdrop
    // const signature = await connection.requestAirdrop(acc.publicKey, web3.LAMPORTS_PER_SOL)

    // await connection.confirmTransaction(signature)

    // const info = await connection.getAccountInfo(acc.publicKey)
    // console.log(info)

    const myToken = new splToken.Token(
        connection,
        tokenPublicKey,
        splToken.TOKEN_PROGRAM_ID,
        fromWallet
    )

    // Get associate acc
    const associatedToTokenAccount = await splToken.Token.getAssociatedTokenAddress(
        myToken.associatedProgramId,
        myToken.programId,
        tokenPublicKey,
        toWallet
    )

    const receiverAccount = await connection.getAccountInfo(associatedToTokenAccount)

    console.log('receiverAccount', associatedToTokenAccount, receiverAccount)

    // Create associated token accounts for my token if they don't exist yet
    const fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
        fromWallet.publicKey
    )

    const transaction = new web3.Transaction()
    
    if (receiverAccount === null) {
        transaction.instructions.push(splToken.Token.createAssociatedTokenAccountInstruction(
            myToken.associatedProgramId,
            myToken.programId,
            tokenPublicKey,
            associatedToTokenAccount,
            toWallet
        ))
    }
    console.log(associatedToTokenAccount)

    // Add token transfer instructions to transaction
    

    // transaction.instructions.push(splToken.Token.createTransferInstruction(
    //     splToken.TOKEN_PROGRAM_ID,
    //     fromTokenAccount.address,
    //     associatedToTokenAccount,
    //     fromWallet.publicKey,
    //     [],
    //     100000000
    // ))

    transaction.feePayer = fromWallet.publicKey

    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash

    // Sign transaction, broadcast, and confirm
    const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet]
    )

    console.log('SIGNATURE', signature)
// -------------------------
    // const transactionSignature = await connection.sendRawTransaction(
    //     transaction.serialize(),
    //     { skipPreflight: true }
    // )

    // const result = await connection.confirmTransaction(transactionSignature)
    // console.log(result)
    console.log('SUCCESS')
}

run([
    // { address: 'FqEu8oAcnVQkpJ1zEw1nvAX7chyFo5VCPVS2P4BN5unk', amount: 100000000 },
    { address: '9oJW1ruZsje7kzsDuf7fZoMEhsjurNmfzNnDiH8CRZry', amount: 100000000 },
    { address: 'HisXdsAR3A5ijjHNQuhpxcyN5uDdQ8bFaUnt3qiH2EXT', amount: 100000000 }
])
