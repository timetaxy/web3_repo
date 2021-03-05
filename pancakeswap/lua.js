const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const luaswapPrice = require('./price')
const uniswapSDK = require('@uniswap/sdk') //JSBI, Percent, Token, TokenAmount, WETH } from
const JSBI = uniswapSDK.JSBI
const ERC20_ABI = require('../abis/ERC20.json')
const RouterV2Abi = require('../abis/UniswapV2Router02.json')
const BigNumber = require('bignumber.js')
const request = require('request').defaults({ rejectUnauthorized: false })

const DAI_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56" // busd
const BAS_ADDRESS = "0x4da996c5fe84755c80e108cf96fe705174c5e36a" // wow
const wbnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

const BAS_DECIMAL = 18
const DAI_DECIMAL = 18


class Lua {
    constructor(privateKey, rpc) {
        this.privateKey = privateKey;
        const provider = new HDWalletProvider(privateKey, rpc);
        this.web3 = new Web3(provider);
        this.address = this.web3.eth.accounts.privateKeyToAccount('0x' + privateKey).address;
        // this.eventEmitter = new events.EventEmitter();
    }

    async getPrice () {
        // slow - TODO use promise all
        let result = await Promise.all([
            luaswapPrice.getExecutionPrice(
                [BAS_ADDRESS, 18],
                [DAI_ADDRESS, 18],
                "10000000000000000000"),
            luaswapPrice.getExecutionPrice(
                [BAS_ADDRESS, 18],
                [DAI_ADDRESS, 18],
                "20000000000000000000"),
            luaswapPrice.getExecutionMidTokensPriceOut(
                [BAS_ADDRESS, 18],
                [DAI_ADDRESS, 18],
                [wbnb, 18],
                "10000000000000000000"),
            luaswapPrice.getExecutionMidTokensPriceOut(
                [BAS_ADDRESS, 18],
                [DAI_ADDRESS, 18],
                [wbnb, 18],
                "20000000000000000000"),

            // luaswapPrice.getExecutionPrice(BAS_ADDRESS, BAS_DECIMAL, DAI_ADDRESS, DAI_DECIMAL, "10000000000000000000"),
            // luaswapPrice.getExecutionPrice(BAS_ADDRESS, BAS_DECIMAL, DAI_ADDRESS, DAI_DECIMAL, "20000000000000000000"),

            // luaswapPrice.getExecutionPriceOut(DAI_ADDRESS, DAI_DECIMAL, BAS_ADDRESS, BAS_DECIMAL, "10000000000000000000"),
            // luaswapPrice.getExecutionPriceOut(DAI_ADDRESS, DAI_DECIMAL, BAS_ADDRESS, BAS_DECIMAL, "20000000000000000000"),
        ])
        return {
            bids: [
                {
                    amount: "10",
                    pricepoint: result[0]
                },
                {
                    amount: "20",
                    pricepoint: result[1]
                },

            ],
            asks: [
                {
                    amount: "10",
                    pricepoint: result[2]
                },
                {
                    amount: "20",
                    pricepoint: result[3]
                },
            ]
        }
    }

    /*
        scenario
        - call to 0x05d3606d5c81eb9b7b18530995ec9b29da05faba
        - function approve
            -	spender	address	0x1d5C6F1607A171Ad52EFB270121331b3039dD83e : pair address
            -	value	uint256	amount
    */
    async approve(amountDecimal, approveTo) {
        console.log("approveTo ", approveTo)
        let suggestedGasPrice = await this.web3.eth.getGasPrice()

        return new Promise((resolve, reject) => {
            let contract = new this.web3.eth.Contract(
                ERC20_ABI, approveTo, {
                gas: 100000,
                gasPrice: new BigNumber(suggestedGasPrice).multipliedBy(1.2).toString()
            });

            contract.methods.approve(DAI_BAS_PAIR_ADDRESS, amountDecimal)
                .send({
                    from: this.address,
                })
                .on('error', (error) => {
                    // console.log("approving error ", error, amountDecimal, approveTo, )
                    reject(error);
                })
                .then((receipt) => {
                    console.log("approving ", amountDecimal, approveTo, " successed")
                    resolve(receipt);
                });
        })
    }

    async getAllowance(amountDecimal, approveTo) {
        let suggestedGasPrice = await this.web3.eth.getGasPrice()

        return new Promise((resolve, reject) => {
            let contract = new this.web3.eth.Contract(
                ERC20_ABI, approveTo, {
                gas: 100000,
                gasPrice: new BigNumber(suggestedGasPrice).multipliedBy(1.2).toString()
            });

            contract.methods.allowed(this.address, DAI_BAS_PAIR_ADDRESS)
                .send({
                    from: this.address,
                })
                .on('error', (error) => {
                    console.log("approving error ", error, amountDecimal, approveTo,)
                    reject(error);
                })
                .then((value) => {
                    console.log("approving ", amountDecimal, approveTo, " successed")
                    resolve(value);
                });
        })
    }

    async getBalance(scAddress, decimal) {
        let contract = new this.web3.eth.Contract(
            ERC20_ABI, scAddress, {
            gas: 250000
        });
        return new Promise((resolve, reject) => {
            try {
                contract.methods.balanceOf(
                    this.address
                )
                    .call()
                    .then(res => {
                        if (decimal) {
                            resolve(new BigNumber(res).dividedBy(
                                new BigNumber(10 ** parseInt(decimal))
                            ).toString())
                        } else {
                            resolve(res);
                        }
                    });
            } catch (ex) {
                console.log("Err ", err)
                reject(ex);
            }
        })
        
    }

    /**
     * Swap token to token follow the path
     * result of swap will be sent to "to"
     */
    async swap (trade) {
        /*
            swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)
            0	amountIn	uint256	1000000000000000000
            1	amountOutMin	uint256	632073
            2	path	address[]	0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa
                                    0xdac17f958d2ee523a2206206994597c13d831ec7
                                    0xdac17f958d2ee523a2206206994597c13d831ec7
            3	to	address	0xf31Ac105B9d670302E7C88189D8F75c770042BC5
            4	deadline	uint256	1605599364
        */
        let suggestedGasPrice = await this.web3.eth.getGasPrice()
        let deadline = parseInt(new Date(new Date().valueOf() + 10000000).valueOf() / 1000) // deadline 100s from now
        
        let originalQuoteBalance = await this.getBalance(DAI_ADDRESS, DAI_DECIMAL)
        let originalBaseBalance = await this.getBalance(BAS_ADDRESS, BAS_DECIMAL)

        return new Promise((resolve, reject) => {
            let contract = new this.web3.eth.Contract(
                RouterV2Abi, DAI_BAS_PAIR_ADDRESS, {
                gas: 250000,
                gasPrice: new BigNumber(suggestedGasPrice).multipliedBy(1.2).toFixed(0)
            });
            console.log("swap with gasPrice ", new BigNumber(suggestedGasPrice).multipliedBy(1.2).toFixed(0))
            console.log("swap with gasLimit ", 250000)
            console.log("swap deadline ", deadline)
            
            try {
                contract.methods.swapExactTokensForTokens(
                    trade.inputAmount.toSignificant(6),
                    trade.outputAmount.toSignificant(6),
                    trade.route.path.map(token => token.address),
                    this.address,
                    deadline
                )
                    .send({
                        from: this.address,
                    })
                    .on('error', (error) => {
                        reject(error);
                    })
                    .then(async (receipt) => {
                        let QuoteBalance = await this.getBalance(DAI_ADDRESS, DAI_DECIMAL)
                        let BaseBalance = await this.getBalance(BAS_ADDRESS, BAS_DECIMAL)

                        resolve({
                            originalQuoteBalance, originalBaseBalance,
                            QuoteBalance, BaseBalance,
                            receipt
                        });
                    });
            } catch(ex) {
                console.log("Err ", err)
                reject(ex);
            }
        })
    }

    async createOrder({
        side, // BUY,SELL
        amount, // string
    }) {
        let trade;
        let amountDecimal;
        try {
            // approve first
            if (side == "SELL") {
                amountDecimal = new BigNumber(amount).multipliedBy(
                    10 ** BAS_DECIMAL
                ).toString()
                
                // try {
                //     await this.approve(amountDecimal, BAS_ADDRESS)    
                // } catch (error) {
                //     console.log("unable to approved selling ", amountDecimal, BAS_ADDRESS)
                // }
                
                trade = await luaswapPrice.getExecutionTrade(BAS_ADDRESS, BAS_DECIMAL, DAI_ADDRESS, DAI_DECIMAL, amountDecimal)
                
                console.log("selling TOMOE amount ", trade.inputAmount.toSignificant(6))
                console.log("selling Expect USDT amount ", trade.outputAmount.toSignificant(6))
                console.log("selling path ", trade.route.path.map(token => token.address))

                trade.inputAmount = trade.inputAmount.multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(BAS_DECIMAL)))
                trade.outputAmount = trade.outputAmount
                    .multiply(
                        JSBI.exponentiate(JSBI.BigInt(10),
                        JSBI.BigInt(DAI_DECIMAL))
                    )
                    .multiply(JSBI.BigInt(99))
                    .divide(JSBI.BigInt(100))

            } else {
                amountDecimal = new BigNumber(amount).multipliedBy(
                    10 ** BAS_DECIMAL
                ).toString()
                trade = await luaswapPrice.getExecutionTradeOut(DAI_ADDRESS, DAI_DECIMAL, BAS_ADDRESS, BAS_DECIMAL, amountDecimal)

                let amountNeededUSDT = trade.inputAmount.multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DAI_DECIMAL))).toSignificant(6)

                // try {
                //     await this.approve(amountNeededUSDT, DAI_ADDRESS)
                // } catch (error) {
                //     console.log("unable to approved buying ", amountNeededUSDT, DAI_ADDRESS)
                // }

                console.log("buying TOMOE with USDT amount ", trade.inputAmount.toSignificant(6))
                console.log("buying Expect TOMOE amount ", trade.outputAmount.toSignificant(6))
                console.log("buying path ", trade.route.path.map(token => token.address))

                trade.inputAmount = trade.inputAmount.multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DAI_DECIMAL)))
                trade.outputAmount = trade.outputAmount
                    .multiply(
                        JSBI.exponentiate(JSBI.BigInt(10),
                        JSBI.BigInt(BAS_DECIMAL))
                    )
                    .multiply(JSBI.BigInt(99))
                    .divide(JSBI.BigInt(100))
            }

            // swap 
            let txReceipt = await this.swap(trade)
            return txReceipt;

        } catch (error) {
            return error;
        }
    }

    // unable to cancel
    async cancelOrder(orderId) {
    }

    // return estimated fees in eth
    async estimateFee(){
        let suggestedGasPrice = await this.web3.eth.getGasPrice()
        let ethInfo = await this._getETHPrice()
        let approveFee = new BigNumber(suggestedGasPrice).multipliedBy(120000).dividedBy(10 ** BAS_DECIMAL).toFixed(8)
        let swapFee = new BigNumber(suggestedGasPrice).multipliedBy(300000).dividedBy(10 ** BAS_DECIMAL).toFixed(8);

        return {
            approveFeeETH: approveFee,
            swapFeeETH: swapFee,
            approveFee: parseFloat(ethInfo.market_data.current_price.usd) * parseFloat(approveFee),
            swapFee: parseFloat(ethInfo.market_data.current_price.usd) * parseFloat(swapFee),
        }
    }

    async _getETHPrice() {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'GET',
                url: "https://api.coingecko.com/api/v3/coins/ethereum",
                json: true,
                headers: {
                    'content-type': 'application/json'
                }
            }
            request(options, (error, response, body) => {
                if (error) {
                    return reject(error)
                }

                return resolve(body)
            })
        })
    }

    async getOrder(txhash) {
        return await this.web3.eth.getTransactionReceipt(txhash)
    }
}

module.exports = Lua
