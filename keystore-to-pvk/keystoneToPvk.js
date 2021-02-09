const fs = require('fs')
const createKeccakHash = require('keccak')
const crypto = require('crypto')
const scrypt = require("scrypt-js")

const deriveKeyScrypt = async (password, salt, options) => {
    const n = options.kdfparams.n
    const r = options.kdfparams.r
    const p = options.kdfparams.p
    const dklen = options.kdfparams.dklen
    const scrypt1 = await scrypt.syncScrypt(password, salt, n, r, p, dklen)

    return Buffer.from(scrypt1)
}

const deriveKey = (password, salt, options) => {
    if (!password && !salt) {
        throw new Error('password or salt not found')
    }
    const pwd = Buffer.from(password, 'utf8')
    const slt = Buffer.from(salt)

    if (options.kdf === 'scrypt') {
        return deriveKeyScrypt(pwd, slt, options)
    }

}

const getMAC = (derivedKey, ciphertext) => {
    if (derivedKey && ciphertext) {
        return keccak256(Buffer.concat([
            Buffer.from(derivedKey).slice(16, 32),
            Buffer.from(ciphertext)
        ])).toString("hex")
    }
}

function keccak256(buffer) {
    return createKeccakHash("keccak256").update(buffer).digest();
}
const isCipherAvailable = (cipher) => {
    return crypto.getCiphers().some(function (name) { return name === cipher; });
}

const decrypt = (ciphertext, key, iv, algo) => {
    let decipher, plaintext
    if (!isCipherAvailable(algo)) throw new Error(algo + " is not available");
    decipher = crypto.createDecipheriv(algo, Buffer.from(key), Buffer.from(iv));
    plaintext = decipher.update(Buffer.from(ciphertext));
    return Buffer.concat([plaintext, decipher.final()]);
}

const isHex = (str) => {
    if (str.length % 2 === 0 && str.match(/^[0-9a-f]+$/i)) return true;
    return false;
}
const isBase64 = (str) => {
    var index;
    if (str.length % 4 > 0 || str.match(/[^0-9a-z+\/=]/i)) return false;
    index = str.indexOf("=");
    if (index === -1 || str.slice(index).match(/={1,2}/)) return true;
    return false;
}

const str2buf = (str, enc) => {
    if (!str || str.constructor !== String) return str;
    if (!enc && isHex(str)) enc = "hex";
    if (!enc && isBase64(str)) enc = "base64";
    return Buffer.from(str, enc);
}

async function run () {
    const password = 'something'
    const file = JSON.parse(fs.readFileSync('./keystone.json', 'utf8'))
    keyObjectCrypto = file.Crypto || file.crypto

    const iv = str2buf(keyObjectCrypto.cipherparams.iv)
    const salt = str2buf(keyObjectCrypto.kdfparams.salt)
    const ciphertext = str2buf(keyObjectCrypto.ciphertext)
    const algo = keyObjectCrypto.cipher

    if (keyObjectCrypto.kdf === "pbkdf2" && keyObjectCrypto.kdfparams.prf !== "hmac-sha256") {
        throw new Error("PBKDF2 only supported with HMAC-SHA256");
    }
    const derivedKey = await deriveKey(password, salt, keyObjectCrypto)
    const mac = getMAC(derivedKey, ciphertext)
    if (mac !== keyObjectCrypto.mac) {
        throw new Error("message authentication code mismatch")
    }
    let key
    if (file.version === "1") {
        key = keccak256(derivedKey.slice(0, 16)).slice(0, 16);
    } else {
        key = derivedKey.slice(0, 16);
    }

    const a = decrypt(ciphertext, key, iv, algo)
    console.log('Private key:', a.toString('hex'))
}
run()