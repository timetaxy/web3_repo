const Wallet = require('ethereumjs-wallet').default
const fs = require('fs')

async function run () {
    const pk = ''
    const buffer = Buffer.from(pk, 'hex')
    const account = Wallet.fromPrivateKey(buffer)
    const password = 'something'
    const json = JSON.stringify(await account.toV3(password))
    const address = account.getAddress().toString('hex')
    const file = `UTC--${new Date().toISOString().replace(/[:]/g, '-')}--${address}`
    fs.writeFileSync(file, json)
}
run()
