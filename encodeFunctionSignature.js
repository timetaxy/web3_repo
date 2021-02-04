const Web3 = require('web3')
const PrivateKeyProvider = require('truffle-privatekey-provider')

const privatekey = ''
const walletProvider = new PrivateKeyProvider(
	privatekey,
	'https://rpc.devnet.tomochain.com'
)
const web3 = new Web3(walletProvider)

async function run () {
	const a = await web3.eth.abi.encodeFunctionSignature({
		"constant": false,
		"inputs": [
		  {
			"name": "owner",
			"type": "address"
		  }
		],
		"name": "addOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  })
	  console.log(a)
}
run()