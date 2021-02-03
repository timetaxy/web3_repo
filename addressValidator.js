const WAValidator = require('wallet-address-validator')

const run = (address) => {
    return `
    BTC: ${WAValidator.validate(address, 'BTC')}
    ETH: ${WAValidator.validate(address, 'ETH')}
    `
}

console.log(run('0xd8445e9dcef2af9c83be01cd0d39154b52e9e60146ab6a2c6dd63aeb21964f93'))