const Web3 = require('web3')
const PrivateKeyProvider = require('@truffle/hdwallet-provider')
const config = require('config')


async function run (message) {
    const account = '0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe'
    const walletProvider = new PrivateKeyProvider(
        config.get('truffle.privateKey'),
        'https://rpc.devnet.tomochain.com'
    )
    const web3 = new Web3(walletProvider)

    const hash = web3.utils.soliditySha3({ t: 'string', v: message })
    console.log(hash)
    const hash2 = web3.eth.accounts.hashMessage(hash)
    console.log(hash2)

    const personalSign = await web3.eth.personal.sign(hash, account, '')
    const ethSign = await web3.eth.sign(hash, account)
    const accountSign = await web3.eth.accounts.sign(hash, config.get('truffle.privateKey'))

    const verify = await web3.eth.personal.ecRecover(hash, ethSign)

    console.log(`
    personalSignn: ${personalSign}
    ethSign: ${ethSign}
    accountSign: ${JSON.stringify(accountSign)}
    `)
    console.log(verify)
}
run('abcd')
// 0xae74d9b809997e2ecd8313a7df04b0d4c0c3c3d73b828056a15220980d5f11093927700fb9cc87a9d52851d83a45eefd2bd3624f587d52aada0b53a23519b69c1c