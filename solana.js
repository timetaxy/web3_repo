const web3 = require('@solana/web3.js')
const axios = require('axios')

const run = async () => {
    try {
        console.log(web3.clusterApiUrl('mainnet-beta'))
        // mainnet-beta, testnet, devnet
        const connection = new web3.Connection('https://solscan-dedicated6.rpcpool.com/59eb803918e4e73864237dc23290', 'confirmed');
        // const b = await connection.getAccountInfo(new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'))
        // console.log(b)
        // const { data } = await axios.post(
        //     web3.clusterApiUrl('mainnet-beta'),
        //     {
        //         "jsonrpc":"2.0",
        //         "id":1,
        //         "method":"getEpochInfo"
        //     }
        // )
        const a = await connection.getParsedProgramAccounts(new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), {
            encoding: "jsonParsed",
            filters: [
                {
                    dataSize: 165
                },
                {
                    memcmp: {
                        offset: 0,
                        bytes: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac'
                        // bytes: 'HppJbUYU4a9i3dXo1x1SS5ieaKEz4cAPWMg4eNQzabzg'
                    }
                }
            ]
        })
        console.log(a.length)
    } catch (error) {
        console.log(error)
    }
}

run()
