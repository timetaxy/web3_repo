const Web3 = require('web3')
const path = require('path')
const fs = require('fs')
const BigNumber = require('bignumber.js')
const solc = require('solc')
const pkey = ''
const PrivateKeyProvider = require('truffle-privatekey-provider')

function createContract () {
    try {
        const p = path.resolve(__dirname, './contracts', 'TRC21.sol')
        const contractCode = fs.readFileSync(p, 'UTF-8')
        return contractCode
    } catch (error) {
        throw error
    }
}

function compileContract (contractCode) {
    try {
        const compiledContract = solc.compile(contractCode, 1)
        console.log(compiledContract)
        const contract = compiledContract.contracts['MyTRC21'] ||
            compiledContract.contracts[':' + 'MyTRC21']
        return contract
    } catch (error) {
        throw error
    }
}
async function deployContract (
    trcContract,
    web3,
    token
) {
    return new Promise(async (resolve, reject) => {
        try {
            const account = (await web3.eth.getAccounts())[0]

            const TRC21Contract = new web3.eth.Contract(
                trcContract.abi, null, { data: '0x' + trcContract.bytecode })
            await TRC21Contract.deploy({
                arguments: [
                    token._OWNER,
                    token._REQUIRED,
                    token._NAME,
                    token._SYMBOL,
                    token._DECIMALS,
                    token.CAP,
                    token.MINFEE,
                    token.DEPOSITFEE,
                    token.WITHDRAWFEE
                ]
            }).send({
                from: account.toLowerCase(),
                gas: web3.utils.toHex(4000000),
                gasPrice: web3.utils.toHex(10000000000000)
            })
                .on('error', (error) => {
                    return reject(error)
                })
                .on('transactionHash', async (txHash) => {
                    let check = true
                    while (check) {
                        const receipt = await web3.eth.getTransactionReceipt(txHash)
                        if (receipt) {
                            check = false
                            const contractAddress = receipt.contractAddress
                            return resolve(contractAddress)
                        }
                    }
                })
        } catch (error) {
            return reject(error)
        }
    })
}

async function run () {
    try {
        if (!pkey) {
            throw new Error('pkey not found')
        }
        const walletProvider = new PrivateKeyProvider(
            pkey,
            'https://rpc.devnet.tomochain.com'
        )
        const web3 = new Web3(walletProvider)
        // const provider = new ethers.providers.JsonRpcProvider("https://rpc.devnet.tomochain.com")
        // const wallet = new ethers.Wallet(pkey, provider)
    
        console.log('Creating contract')
        const contractCode = createContract()
        console.log('Compiling contract')
        const contract = compileContract(contractCode)
    
        const bytecode = contract.bytecode
        const abi = JSON.parse(contract.interface)
        const trcContract = {
            abi, bytecode
        }
        const token = {
            _OWNER: ["0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe"],
            _REQUIRED: 2,
            _NAME: 'Wrap ETH',
            _SYMBOL: 'WETH',
            _DECIMALS: 18,
            CAP: (new BigNumber(10000000).multipliedBy(10 ** 18)).toString(10),
            MINFEE: (new BigNumber(0.01).multipliedBy(10 ** 18)).toString(10),
            DEPOSITFEE: 0,
            WITHDRAWFEE: 0
        }
        console.log('Deploying contract')
    
        const contractAddress = await deployContract(
            trcContract,
            web3,
            token
        )
        console.log('contract address', contractAddress)
    } catch (error) {
        console.log(error)
    }
}
run()