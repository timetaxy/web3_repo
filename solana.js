const web3 = require('@solana/web3.js')
const axios = require('axios')

const run = async () => {
    console.log(web3.clusterApiUrl('mainnet-beta'))
    // mainnet-beta, testnet, devnet
    const connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'), 'confirmed');
    const { data } = await axios.post(
        web3.clusterApiUrl('mainnet-beta'),
        {
            "jsonrpc":"2.0",
            "id":1,
            "method":"getEpochInfo"
        }
    )
}

run()
