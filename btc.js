const secureRandom = require('secure-random');
const ec = require('elliptic').ec;
const fs = require('fs');
const sha256 = require('js-sha256');
const ripemd160 = require('ripemd160');
const base58 = require('base58')

function createPublicAddress(publicKeyHash) {
    // step 1 - add prefix "00" in hex
    const step1 = Buffer.from("00" + publicKeyHash, 'hex');
    // step 2 - create SHA256 hash of step 1
    const step2 = sha256(step1);
    // step 3 - create SHA256 hash of step 2
    const step3 = sha256(Buffer.from(step2, 'hex'));
    // step 4 - find the 1st byte of step 3 - save as "checksum"
    const checksum = step3.substring(0, 8);
    // step 5 - add step 1 + checksum
    const step4 = step1.toString('hex') + checksum;
    // return base 58 encoding of step 5
    const address = base58.encode(Buffer.from(step4, 'hex'));
    return address;
  }

function createPrivateKeyWIF(privateKey) {
    const step1 = Buffer.from("80" + privateKey, 'hex');
    const step2 = sha256(step1);
    const step3 = sha256(Buffer.from(step2, 'hex'));
    const checksum = step3.substring(0, 8);
    const step4 = step1.toString('hex') + checksum;
    const privateKeyWIF = base58.encode(Buffer.from(step4, 'hex'));
    return privateKeyWIF;
  }

function  run () {
    try {
        const max = Buffer.from("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140", 'hex');  
        let isInvalid = true;  
        let privateKey;  
        while (isInvalid) {    
        privateKey = secureRandom.randomBuffer(32);
        console.log(privateKey)
            if (Buffer.compare(max, privateKey) === 1) {      
                isInvalid = false;     
            }  
        }
        console.log('> Private key: ', privateKey.toString('hex'));

        const ecdsa = new ec('secp256k1')

        const keys = ecdsa.keyFromPrivate(privateKey)

        const publicKey = keys.getPublic('hex')

        let hash = sha256(Buffer.from(publicKey, 'hex'));
        let publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest();

        const address = createPublicAddress(publicKeyHash)

        const pkWIF = createPrivateKeyWIF(privateKey)

        const data = {
            privateKey: privateKey.toString('hex'),
            pubKey: keys.getPublic('hex'),
            address,
            pkWIF
        }
        console.log('data',data)

        fs.writeFileSync('./key.txt', data);
    } catch (error) {
        console.log(error)
    }
}

run()