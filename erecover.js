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
    // '0x636136144d300052291d75da4cc1b10f127d0e3ced5ae6bf6adc8eb134ef7324',
    '0x4fff5c9b739673c02a41e6dbcd78fd92e795dd09c4a7e1f9a68dd0c6b2aad1cd',
    // '0xa6b405d6b1c9ac6917b63ffa7eb8f703dff666f7f74e8db264c17a9c26fc83646f3f29860c678058bbc5c2dbf22086b2edfbfcfce5e22788175a8e84491df62e1b'
    '0xb730d6ee1d18afe3af745af9422e57cb83e9b7b1b9dfb47547915a76988d623a1eb7df3d0c6602ad7adefbe35767d0debed355d74f803ffe8acf773cbcdd39151b'
))