const {
    ChainId,
    Token,
    WETH,
    Fetcher,
    Route,
    Trade,
    TokenAmount,
    TradeType
} = require('@uniswap/sdk')
const {
    getNetwork
} = require('@ethersproject/networks')

const {
    getDefaultProvider,
    InfuraProvider
} = require('@ethersproject/providers')

let INFURAKEY = ""
const setInfuraKey = (infuraKey) => {
    INFURAKEY = infuraKey
}

const getExecutionPrice = async (baseToken, baseDecimal, quoteToken, quoteDecimal, tradeAmount, chainId, infuraKey) => {
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
        pair = await Fetcher.fetchPairData(quote, base, network),
        route = await new Route([pair], base),
        base2quote = await route.midPrice.toSignificant(6),
        quote2base = await route.midPrice.invert().toSignificant(6),
        trade = new Trade(route, new TokenAmount(base, tradeAmount), TradeType.EXACT_INPUT)

    return trade.executionPrice.toSignificant(6)
}

const getExecutionPriceOut = async (baseToken, baseDecimal, quoteToken, quoteDecimal, tradeAmount, chainId, infuraKey) => {
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
        const base = new Token(chainId, baseToken[0], baseToken[1])
        const quote = new Token(chainId, quoteToken[0], quoteToken[1])
        const mid = new Token(chainId, midToken[0], midToken[1])
    
        const quoteMid = await Fetcher.fetchPairData(quote, mid, network)
        const midBase = await Fetcher.fetchPairData(mid, base, network)

        const route = await new Route([quoteMid, midBase], quote)
        const trade = new Trade(route, new TokenAmount(quote, tradeAmount), TradeType.EXACT_INPUT)

        return trade.executionPrice.invert().toSignificant(6)

    
        // let trade = Trade.bestTradeExactOut([quoteMid, midBase], base, new TokenAmount(quote, tradeAmount), { maxHops: 3, maxNumResults: 1 })[0]
    
        // return trade.executionPrice.toSignificant(6)
    } catch (error) {
        throw error
    }
}


const getExecutionTrade = async (baseToken, baseDecimal, quoteToken, quoteDecimal, tradeAmount, chainId, infuraKey) => {
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
        pair = await Fetcher.fetchPairData(quote, base, network),
        route = await new Route([pair], base),
        trade = new Trade(route, new TokenAmount(base, tradeAmount), TradeType.EXACT_INPUT)

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
