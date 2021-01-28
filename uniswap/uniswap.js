const {
    ChainId, Token, WETH, Fetcher, Route, Trade,
    TradeType,
    TokenAmount,
    Percent
} = require('@uniswap/sdk')

async function getPrice () {
    const t0 = new Date()
    // dai 0x6B175474E89094C44Da98b954EedeAC495271d0F
    const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18)
    // crv 0xd533a949740bb3306d119cc777fa900ba034cd52
    const CRV = new Token(ChainId.MAINNET, '0xd533a949740bb3306d119cc777fa900ba034cd52', 18)

    // base mid quote
    const baseToken = ['0x69a95185ee2a045cdc4bcd1b1df10710395e4e23', 18] //poolz
    const quoteToken = ['0xdac17f958d2ee523a2206206994597c13d831ec7', 6] // usdt
    const midToken = ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18] // weth
    let base = new Token(ChainId.MAINNET, baseToken[0], baseToken[1]),
        quote = new Token(ChainId.MAINNET, quoteToken[0], quoteToken[1]),
 	    mid = new Token(ChainId.MAINNET, midToken[0], midToken[1])
        quoteMid = await Fetcher.fetchPairData(quote, mid),
        midBase = await Fetcher.fetchPairData(mid, base),
        route = await new Route([midBase, quoteMid], base),
        base2quote = await route.midPrice.toSignificant(6),
        quote2base = await route.midPrice.invert().toSignificant(6)
        trade = new Trade(route, new TokenAmount(base, 1000000000000000000), TradeType.EXACT_INPUT)

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

    // console.log(`1 DAI = ${route.midPrice.toSignificant(6)} CRV`) // 201.306
    // console.log(`1 CRV = ${route.midPrice.invert().toSignificant(6)} DAI`) // 0.00496756
}

getPrice()