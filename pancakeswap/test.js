const Lua = require('./lua')
const luaswapPrice = require('./price')
const uniswapSDK = require('@uniswap/sdk') //JSBI, Percent, Token, TokenAmount, WETH } from
const JSBI = uniswapSDK.JSBI
const BigNumber = require('bignumber.js')
const {
    ChainId,
    Token,
    WETH,
    Fetcher,
    Route,
    Trade,
    TokenAmount,
    TradeType,
    Pair,
    ETHER,
    CurrencyAmount
} = require('@pancakeswap-libs/sdk')
const {
    getNetwork
} = require('@ethersproject/networks')

const {
    getDefaultProvider,
    InfuraProvider
} = require('@ethersproject/providers')

const { Interface } = require('@ethersproject/abi')
const IUniswapV2PairABI = require('../abis/IUniswapV2Pair.json')
const config = require('config')

const ERC20Abi = require('../abis/ERC20.json')
const Web3 = require('web3')
const axios = require('axios')

const chainId = 56

const rpc = 'https://bsc-dataseed.binance.org/'

// const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

function wrappedCurrency(currency, chainId) {
    // eslint-disable-next-line no-nested-ternary
    return chainId && currency === ETHER ? WETH[chainId] : currency instanceof Token ? currency : undefined
}

function wrappedCurrencyAmount(
    currencyAmount,
    chainId
  ) {
    const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
    return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

function getPairs (arr) {
    let res = [],
        l = arr.length
    for(var i=0; i<l; ++i)
        for(var j=i+1; j<l; ++j)
            res.push([
                new Token(ChainId.MAINNET, arr[i][0], arr[i][1]),
                new Token(ChainId.MAINNET, arr[j][0], arr[j][1])
            ])
    return res
}


async function run (baseToken, quoteToken, pairList, tradeAmount, chainId) {
    const base = new Token(chainId, baseToken[0], baseToken[1])
    const quote = new Token(chainId, quoteToken[0], quoteToken[1])
    const a = [baseToken]
    pairList.map(i => a.push(i))
    const pairs = getPairs(a)

    const pairFetchs = await Promise.all(pairs.map(async p => {
        const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
        const contract = new web3.eth.Contract(
            IUniswapV2PairABI.abi,
            Pair.getAddress(p[0], p[1])
        )
        const [token0, token1] = p[0].sortsBefore(p[1]) ? [p[0], p[1]] : [p[1], p[0]]
        const results = await contract.methods.getReserves().call()
        if (results) {
            const { reserve0, reserve1 } = results
            return new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
        }
        return null
    }))

    const avaiablePairs = pairFetchs.map(p => {
        if (p !== undefined) {
            return p
        }
    })
    const route = await new Route([avaiablePairs[0]], base)
    const trade = new Trade(route, new TokenAmount(base, tradeAmount), TradeType.EXACT_INPUT)

    const trade2 = Trade.bestTradeExactOut(avaiablePairs, quote, new TokenAmount(base, tradeAmount), { maxHops: 3, maxNumResults: 1})[0]
    const trade3 = Trade.bestTradeExactIn(avaiablePairs, new TokenAmount(base, tradeAmount), quote, { maxHops: 3, maxNumResults: 1})[0]

    const route2 = await new Route([avaiablePairs[0]], quote) // weth/poolz + dai/weth onput token is quote
    const trade4 = new Trade(route2, new TokenAmount(quote, tradeAmount), TradeType.EXACT_INPUT)

    console.log('----------Route in base --------------------------------')
    console.log(`1 base = ${trade.executionPrice.toSignificant(6)} quote`)
    console.log(`Invert 1 quote = ${trade.executionPrice.invert().toSignificant(6)} base`)
    console.log('')
    console.log('----------Exact out xx quote = 1 base ------------------')
    console.log(`1 quote = ${trade2.executionPrice.toSignificant(6)} base`)
    console.log(`Invert 1 base = ${trade2.executionPrice.invert().toSignificant(6)} quote`)
    console.log('')
    console.log('----------Exact in 1 base = xx quote -------------------')
    console.log(`1 base = ${trade3.executionPrice.toSignificant(6)} quote`)
    console.log(`Invert 1 quote = ${trade3.executionPrice.invert().toSignificant(6)} base`)
    console.log('')
    console.log('----------Route in quote --------------------------------')
    console.log(`1 quote = ${trade4.executionPrice.toSignificant(6)} base`)
    console.log(`Invert 1 base = ${trade4.executionPrice.invert().toSignificant(6)} quote`)

    if (trade2.executionPrice.invert().toSignificant(6) >= 55) {
        axios.get(
            'https://api.telegram.org/bot' +
            config.get('telegramToken') +
            '/sendMessage?' +
            'chat_id=' + config.get('userIdTele') +
            '&text=Wow lên 55 rồi kìa'
        ).catch(error => console.log(error))
    }
}

const busd = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
const wow = "0x4da996c5fe84755c80e108cf96fe705174c5e36a"
const wbnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const usdt = '0x55d398326f99059ff775485246999027b3197955'
const usdc = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'

const decimal = 18;

const pairList = [
    [busd, decimal],
    [wbnb, decimal],
    [usdt, decimal],
    // [usdc, decimal]
]

setInterval(async () => {
    await run(
    [wow, decimal], // base
    [busd, decimal], //quote
    pairList,
    "1000000000000000000", ChainId.MAINNET)
}, 5000);