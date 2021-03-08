const Web3 = require('web3')
const abi = require('./abis/MyTRC21Mintable.json')
const moment = require('moment')

async function run () {
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.devnet.tomochain.com'))

        const contract = new web3.eth.Contract(
            abi.abi,
            '0xc536dc68e617899e97390bb672503f18b75004c1'
        )

        while(true) {
            if (moment().format('X') >= 1615192800) {
                const balance = await contract.methods.balanceOf('0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe').call()
                console.log(balance)
                return balance
            }
        }
    } catch (error) {
        throw error
    }
}

run()
