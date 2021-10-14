const Web3 = require('web3')
const abi = require('./abis/TRC21.json')
const PrivateKeyProvider = require('@truffle/hdwallet-provider')
const BigNumber = require('bignumber.js')

const tokenAddress = ''
const pkey = ''
async function run () {
    const walletProvider = new PrivateKeyProvider(
        pkey,
        'https://rpc.devnet.tomochain.com'
    )
    const web3 = new Web3(walletProvider)

    const contract = new web3.eth.Contract(
        abi.abi,
        tokenAddress
    )
    contract.methods.transfer(
        '0x0000000000000000000000000000000000000000',
        new BigNumber(1000000000000000000000)
    ).send({
        from: '',
        gasLimit: 1000000
    }).then(data => console.log(data))
    .catch(error => console.log(error))
}

run()