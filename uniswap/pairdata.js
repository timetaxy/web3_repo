const {
    ChainId, Token, WETH, Fetcher, Route, Trade,
    TradeType,
    TokenAmount,
    Pair
} = require('@uniswap/sdk')

async function run () {
    const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
    const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
    const add = Pair.getAddress(DAI, USDC)
    console.log(add)
}
run()