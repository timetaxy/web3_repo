const utils = require('ethereumjs-util')

function ecRecover (message, signature) {
    const signatureBuffer = utils.toBuffer(signature)
    const signatureParams = utils.fromRpcSig(signatureBuffer)

    const buffer = Buffer.from(message)
    const msgBuffer = '0x' + buffer.toString('hex')
    const m = utils.toBuffer(msgBuffer)
    const msgHash = utils.hashPersonalMessage(m)

    const publicKey = utils.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s
    )
    const addressBuffer = utils.publicToAddress(publicKey)
    return utils.bufferToHex(addressBuffer)
}

console.log(ecRecover(
    '',
    ''
))