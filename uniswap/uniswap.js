const {
    ChainId, Token, WETH, Fetcher, Route, Trade,
    TradeType,
    TokenAmount,
    Percent
} = require('@uniswap/sdk')
const {
    getDefaultProvider,
    InfuraProvider
} = require('@ethersproject/providers')
const {
    getNetwork
} = require('@ethersproject/networks')

async function getPrice (baseToken, quoteToken, midToken) {
    const t0 = new Date()

    const network = new InfuraProvider(getNetwork(ChainId.MAINNET), 'e9734a58e2af4519b514268c24ab2086')

    // base mid quote
    let base = new Token(ChainId.MAINNET, baseToken[0], baseToken[1]),
        quote = new Token(ChainId.MAINNET, quoteToken[0], quoteToken[1]),
 	    mid = new Token(ChainId.MAINNET, midToken[0], midToken[1])

        // quoteMid = await Fetcher.fetchPairData(quote, mid), // dai/weth

        // midBase = await Fetcher.fetchPairData(mid, base), // weth/poolz

        midQuote = await Fetcher.fetchPairData(quote, mid), // weth/dai

        baseMid = await Fetcher.fetchPairData(mid, base), // poolz/weth

        // base2quote = await route.midPrice.toSignificant(6),
        // quote2base = await route.midPrice.invert().toSignificant(6)

        // get price base to quote // sell
        route = await new Route([baseMid, midQuote], base), // weth/poolz + dai/weth onput token is base
        trade = new Trade(route, new TokenAmount(base, 1000000000000000000), TradeType.EXACT_INPUT)

        // pairs[weth/dai, poolz/weth], tokenIn - DAI, amountOut - 1 POOLZ ---- BUY
        trade2 = Trade.bestTradeExactOut([baseMid, midQuote], base, new TokenAmount(quote, '10000000000000000000'), { maxHops: 3, maxNumResults: 1 })[0]
        // pairs[weth/dai, poolz/weth], amountIn - 1 DAI, tokenOut - POOLZ ---- SELL
        trade3 = Trade.bestTradeExactIn([baseMid, midQuote], new TokenAmount(quote, '10000000000000000000'), base, { maxHops: 3, maxNumResults: 1 })[0]

        // get price quote to base //buy
        route2 = await new Route([midQuote, baseMid], quote), // weth/poolz + dai/weth onput token is quote
        trade4 = new Trade(route2, new TokenAmount(quote, 1000000000000000000), TradeType.EXACT_INPUT)

    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    // const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])
    // const pair = await Fetcher.fetchPairData(CRV, DAI)

    // const route = new Route([pair], WETH[DAI.chainId])
    // const route = new Route([pair], DAI)
    const t1 = new Date()
    console.log(t1 - t0)
    // console.log(base2quote)
    // console.log(quote2base)

    /*
    const slippageTolerance = new Percent('50', '10000') // 0.5%
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw
    const value = trade.inputAmount.raw
    const path = [WETH[DAI.chainId].address, DAI.address]
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
    swapExactTokensForTokens(amountOutMin, path, toAddress, deadline)
    */
    // console.log(`
    //     Route([baseMid, midQuote], base) - take base input
    //     1 POOLZ = ${trade.executionPrice.toSignificant(6)} DAI
    //     ------------------------
    //     Route([midQuote, baseMid], quote) - take quote input
    //     1 DAI = ${trade4.executionPrice.toSignificant(6)} POOLZ
    //     ------------------------
    //     Trade.bestTradeExactOut([baseMid, midQuote], quote, amount-base...
    //     1 POOLZ = ${trade3.executionPrice.toSignificant(6)} DAI
    //     ------------------------
    //     Trade.bestTradeExactIn([baseMid, midQuote], amount-base, quote
    //     1 POOLZ = ${trade4.executionPrice.toSignificant(6)} DAI
    // `)
    console.log(`1 POOLZ = ${trade.executionPrice.toSignificant(6)} DAI`) // 201.306
    console.log(`1 DAI = ${trade.executionPrice.invert().toSignificant(6)} POOLZ`) // 0.00496756
    console.log('---------------------------------')
    // console.log(`1 POOLZ = ${trade2.executionPrice.toSignificant(6)} DAI`) // 201.306
    // console.log(`1 DAI = ${trade2.executionPrice.invert().toSignificant(6)} POOLZ`) // 0.00496756
    console.log('-----------------------------')
    // console.log(`1 POOLZ = ${trade3.executionPrice.toSignificant(6)} DAI`) // 201.306
    // console.log(`1 DAI = ${trade3.executionPrice.invert().toSignificant(6)} POOLZ`) // 0.00496756
    console.log('-----------------------------')
    console.log(`1 POOLZ = ${trade4.executionPrice.toSignificant(6)} DAI`) // 201.306
    console.log(`1 DAI = ${trade4.executionPrice.invert().toSignificant(6)} POOLZ`) // 0.00496756
}

setInterval(async () => {
    await getPrice(
        ['0x69a95185ee2a045cdc4bcd1b1df10710395e4e23', 18], // poolz
        // ['0xa7ED29B253D8B4E3109ce07c80fc570f81B63696', 18], // bas
        ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18], // dai
        
        ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18] // weth
    )
}, 5000);