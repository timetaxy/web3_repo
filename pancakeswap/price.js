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
const Web3 = require('web3')

const {
    getDefaultProvider,
    InfuraProvider
} = require('@ethersproject/providers')

const IUniswapV2PairABI = require('../abis/IUniswapV2Pair.json')

let INFURAKEY = ""
const setInfuraKey = (infuraKey) => {
    INFURAKEY = infuraKey
}

const getExecutionPrice = async (baseToken, quoteToken, tradeAmount) => {
    const base = new Token(ChainId.MAINNET, baseToken[0], baseToken[1])
    const quote = new Token(ChainId.MAINNET, quoteToken[0], quoteToken[1])

    const pairs = [
        [base, quote]
    ]

    const pairFetchs = await Promise.all(pairs.map(async p => {
        const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
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
    const route = await new Route(avaiablePairs, base)

    const trade = new Trade(route, new TokenAmount(base, tradeAmount), TradeType.EXACT_INPUT)
    return trade.executionPrice.toSignificant(6)
}

const getExecutionPriceOut = async (baseToken, baseDecimal, quoteToken, quoteDecimal, tradeAmount, chainId, infuraKey) => {
    const base = new Token(chainId, baseToken[0], baseToken[1])
    const quote = new Token(chainId, quoteToken[0], quoteToken[1])
    const mid = new Token(chainId, midToken[0], midToken[1])

    const pairs = [
        [base, quote],
        [quote, mid],
        [base, mid]
    ]

    const pairFetchs = await Promise.all(pairs.map(async p => {
        const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
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

    let trade = Trade.bestTradeExactIn(avaiablePairs, new TokenAmount(base, tradeAmount), quote, { maxHops: 3, maxNumResults: 1})[0]

    return trade.executionPrice.invert().toSignificant(6)
}

const getExecutionMidTokensPrice = async (baseToken, quoteToken, midToken, tradeAmount, chainId, infuraKey) => {
    if (chainId == undefined) {
        chainId = ChainId.MAINNET
    }

    if (!infuraKey && !INFURAKEY) {
        console.log('Infura key not set!')
    }

    let network

    infuraKey = infuraKey || INFURAKEY
    if (infuraKey != undefined) {
        network = new InfuraProvider(getNetwork(chainId), infuraKey)
    } else {
        network = getDefaultProvider(getNetwork(chainId))
    }
    let base = new Token(chainId, baseToken[0], baseToken[1]),
        quote = new Token(chainId, quoteToken[0], quoteToken[1]),
        mid = new Token(chainId, midToken[0], midToken[1])
    const baseMid = await Fetcher.fetchPairData(base, mid, network)
    const midQuote = await Fetcher.fetchPairData(mid, quote, network)

    const route = await new Route([baseMid, midQuote], base)
    const trade = new Trade(route, new TokenAmount(base, tradeAmount), TradeType.EXACT_INPUT)

    return trade.executionPrice.toSignificant(6)
}

const getExecutionMidTokensPriceOut = async (baseToken, quoteToken, midToken, tradeAmount, chainId, infuraKey) => {
    try {
        const base = new Token(ChainId.MAINNET, baseToken[0], baseToken[1])
        const quote = new Token(ChainId.MAINNET, quoteToken[0], quoteToken[1])
        const mid = new Token(ChainId.MAINNET, midToken[0], midToken[1])

        const pairs = [
            [base, quote],
            [quote, mid],
            [base, mid]
        ]

        const pairFetchs = await Promise.all(pairs.map(async p => {
            const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
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

        let trade = Trade.bestTradeExactOut(avaiablePairs, quote, new TokenAmount(base, tradeAmount), { maxHops: 3, maxNumResults: 1})[0]

        return trade.executionPrice.invert().toSignificant(6)
    } catch (error) {
        throw error
    }
}


const getExecutionTrade = async (baseToken, baseDecimal, quoteToken, quoteDecimal, tradeAmount, chainId, infuraKey) => {
    const base = new Token(ChainId.MAINNET, baseToken, baseDecimal)
    const quote = new Token(ChainId.MAINNET, quoteToken, quoteDecimal)

    const pairs = [
        [base, quote]
    ]

    const pairFetchs = await Promise.all(pairs.map(async p => {
        const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
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
    const route = await new Route(avaiablePairs, base)

    const trade = new Trade(route, new TokenAmount(base, tradeAmount), TradeType.EXACT_INPUT)

    return trade
}

const getExecutionTradeOut = async (baseToken, baseDecimal, quoteToken, quoteDecimal, tradeAmount, chainId, infuraKey) => {
    if (chainId == undefined) {
        chainId = ChainId.MAINNET
    }

    if (!infuraKey && !INFURAKEY) {
        console.log('Infura key not set!')
    }

    let network
    infuraKey = infuraKey || INFURAKEY
    if (infuraKey != undefined) {
        network = new InfuraProvider(getNetwork(chainId), infuraKey)
    } else {
        network = getDefaultProvider(getNetwork(chainId))
    }
    let base = new Token(chainId, baseToken, baseDecimal),
        quote = new Token(chainId, quoteToken, quoteDecimal),
        pair_1 = await Fetcher.fetchPairData(quote, base, network);

    let trade = Trade.bestTradeExactOut([pair_1], base, new TokenAmount(quote, tradeAmount), { maxHops: 3, maxNumResults: 1 })[0]

    return trade
}

const getExecutionPriceViaExactToken = async (baseToken, baseDecimal, quoteToken, quoteDecimal, midToken, midDecimal, tradeAmount, chainId, infuraKey) => {
    if (chainId == undefined) {
        chainId = ChainId.MAINNET
    }

    if (!infuraKey && !INFURAKEY) {
        console.log('Infura key not set!')
    }

    let network
    infuraKey = infuraKey || INFURAKEY
    if (infuraKey != undefined) {
        network = new InfuraProvider(getNetwork(chainId), infuraKey)
    } else {
        network = getDefaultProvider(getNetwork(chainId))
    }
    let base = new Token(chainId, baseToken, baseDecimal),
        quote = new Token(chainId, quoteToken, quoteDecimal),
        mid = new Token(chainId, midToken, midDecimal)
        quoteMid = await Fetcher.fetchPairData(quote, mid, network),
        midBase = await Fetcher.fetchPairData(mid, base, network),
        route = await new Route([midBase, quoteMid], base),
        base2quote = await route.midPrice.toSignificant(6),
        quote2base = await route.midPrice.invert().toSignificant(6),
        trade = new Trade(route, new TokenAmount(base, tradeAmount), TradeType.EXACT_INPUT)

    return trade.executionPrice.toSignificant(6)

}

module.exports = {
    setInfuraKey: setInfuraKey,
    getExecutionPrice: getExecutionPrice,
    getExecutionPriceOut: getExecutionPriceOut,
    getExecutionMidTokensPrice: getExecutionMidTokensPrice,
    getExecutionMidTokensPriceOut: getExecutionMidTokensPriceOut,
    getExecutionTrade: getExecutionTrade,
    getExecutionTradeOut: getExecutionTradeOut,
    getExecutionPriceViaExactToken: getExecutionPriceViaExactToken,
}
