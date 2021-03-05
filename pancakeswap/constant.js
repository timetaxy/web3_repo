const { WETH, ChainId, Token } = require('@uniswap/sdk')
const DAI = new Token(ChainId.MAINNET, '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', 18, 'DAI', 'Dai Stablecoin')
const BUSD = new Token(ChainId.MAINNET, '0xe9e7cea3dedca5984780bafc599bd69add087d56', 18, 'BUSD', 'Binance USD')
const USDT = new Token(ChainId.MAINNET, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'Tether USD')
const UST = new Token(
    ChainId.MAINNET,
    '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
    18,
    'UST',
    'Wrapped UST Token'
)
const ETH = new Token(
    ChainId.MAINNET,
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    18,
    'ETH',
    'Binance-Peg Ethereum Token'
)

const WETH_ONLY = {
    [ChainId.MAINNET]: [WETH[ChainId.MAINNET]]
}

const SUGGESTED_BASES = {
    [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT]
}

const BASES_TO_TRACK_LIQUIDITY_FOR = {
    [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT]
}

const BASES_TO_CHECK_TRADES_AGAINST = {
    [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT, UST, ETH]
}
console.log(WETH_ONLY)