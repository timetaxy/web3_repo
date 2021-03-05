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


async function getPrice (baseToken, quoteToken) {
    const t0 = new Date()

    // base mid quote
    let base = new Token(ChainId.MAINNET, baseToken[0], baseToken[1]),
        quote = new Token(ChainId.MAINNET, quoteToken[0], quoteToken[1])

        baseQuote = await Fetcher.fetchPairData(base, quote),

        // get price base to quote // sell
        route = await new Route([baseQuote], base),
        trade = new Trade(route, new TokenAmount(base, 1000000000000000000), TradeType.EXACT_INPUT)

        // pairs[weth/dai, poolz/weth], tokenIn - DAI, amountOut - 1 POOLZ 
        trade2 = Trade.bestTradeExactOut([baseQuote], base, new TokenAmount(quote, '10000000000000000000'), { maxHops: 3, maxNumResults: 1 })[0]

        // pairs[weth/dai, poolz/weth], amountIn - 1 DAI, tokenOut - POOLZ 
        trade3 = Trade.bestTradeExactIn([baseQuote], new TokenAmount(base, '10000000000000000000'), quote, { maxHops: 3, maxNumResults: 1 })[0]

        // get price quote to base //buy
        route2 = await new Route([baseQuote], quote), // weth/poolz + dai/weth onput token is quote
        trade4 = new Trade(route2, new TokenAmount(quote, 1000000000000000000), TradeType.EXACT_INPUT)

    const t1 = new Date()
    console.log(t1 - t0)

    /*
    const slippageTolerance = new Percent('50', '10000') // 0.5%
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw
    const value = trade.inputAmount.raw
    const path = [WETH[DAI.chainId].address, DAI.address]
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
    swapExactTokensForTokens(amountOutMin, path, toAddress, deadline)
    */
   console.log('----------Route in base --------------------------------')
   console.log(`1 base = ${trade.executionPrice.toSignificant(6)} quote`)
   console.log(`Invert 1 quote = ${trade.executionPrice.invert().toSignificant(6)} base`)
   console.log('----------Exact out xx quote = 1 base ------------------')
   console.log(`1 base = ${trade2.executionPrice.toSignificant(6)} quote`)
   console.log(`Invert 1 quote = ${trade2.executionPrice.invert().toSignificant(6)} base`)
   console.log('----------Exact in 1 base = xx quote -------------------')
   console.log(`1 base = ${trade3.executionPrice.toSignificant(6)} quote`)
   console.log(`Invert 1 quote = ${trade3.executionPrice.invert().toSignificant(6)} base`)
   console.log('----------Route in quote --------------------------------')
   console.log(`1 quote = ${trade4.executionPrice.toSignificant(6)} base`)
   console.log(`Invert 1 base = ${trade4.executionPrice.invert().toSignificant(6)} quote`)
}

setInterval(async () => {
    await getPrice(
        // ['0x69a95185ee2a045cdc4bcd1b1df10710395e4e23', 18], // poolz
        ['0x106538CC16F938776c7c180186975BCA23875287', 18], // bas
        ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18], // dai
    )
}, 5000);