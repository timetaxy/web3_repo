const Web3 = require('web3')
const PrivateKeyProvider = require('@truffle/hdwallet-provider')
const config = require('config')


async function run (message) {
    const account = ''
    const walletProvider = new PrivateKeyProvider(
        config.get('truffle.privateKey'),
        'https://rpc.devnet.tomochain.com'
    )
    const web3 = new Web3(walletProvider)

    const hash = web3.utils.soliditySha3(
        { t: 'address', v: '' },
        { t: 'bytes32', v: '' },
        { t: 'address', v: '' },
        { t: 'uint256', v: 2 },
        { t: 'uint256', v: '10000000000000000000' },
        { t: 'uint', v: '1' }
    )
    console.log(hash)
    const hash2 = web3.eth.accounts.hashMessage(hash)
    console.log('hash2', hash2)

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
// 