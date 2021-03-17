const Web3 = require('web3')
const abi = require('./abis/TRC21.json')
const PrivateKeyProvider = require('@truffle/hdwallet-provider')
const BigNumber = require('bignumber.js')
const TRC21Abi = require('./abis/TRC21.json')
const config = require('config')
const multiSignAbi = require('./abis/WrapperAbi.json')

const tokenList = ['0xc536dc68e617899e97390bb672503f18b75004c1']
const oldMultisign = '0x80C342CE85da0e90EC7D313fAcC3a4D5Bfe9bf0E'
const toAddress = '0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe'

async function run () {
    try {
        const walletProvider = new PrivateKeyProvider(
            config.get('truffle.privateKey'),
            'https://rpc.devnet.tomochain.com'
        )
        const web3 = new Web3(walletProvider)
        const oldMultisignContract = new web3.eth.Contract(
            multiSignAbi.abi,
            oldMultisign
        )
        for (let i = 0; i < tokenList.length; i++) {
            const tokenContract = new web3.eth.Contract(
                TRC21Abi.abi,
                tokenList[i]
            )
            const balance = await tokenContract.methods.balanceOf(oldMultisign).call()
            // const value = new BigNumber(balance).multipliedBy(10 ** 18).toString()
            const value = new BigNumber(balance)

            const transferData = await tokenContract.methods.transfer(
                toAddress,
                value
            ).encodeABI()
            console.log(transferData)
            await oldMultisignContract.methods.submitTransaction(
                tokenList[i],
                0,
                transferData
            ).send({
                gasLimit: web3.utils.toHex(1000000),
                from: toAddress
            }).then(data => {
                if (data.status) {
                    console.log(`Done transfer token ${tokenList[i]} amount ${value}`)
                }
            })
            .catch(error => console.log(error))
            console.log('All done!')
            return
        }
    } catch (error) {
        throw error
    }
}

run ()