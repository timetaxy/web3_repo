const string2byte = (str) => {
    let byteArray = []
    for (let j = 0; j < str.length; j++) {
        byteArray.push(str.charCodeAt(j))
    }
    const a = byteArray.toString().split(' ').join('')

    return a
}
// 48,120,49,54,97,55,51,102,51,65,54,52,69,99,65,55,57,69,49,49,55,50,53,56,101,54,54,100,70,100,55,48,55,49,67,99,56,51,49,50,65,57


// const a = string2byte('0x16a73f3A64EcA79E117258e66dFd7071Cc8312A9')
// console.log(a.toString().split(' ').join(''))

const Web3 = require('web3')
const web3 = new Web3()
const a = web3.utils.hexToBytes('0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe')
const b = a.toString().split(' ').join('')
console.log(b)

// tomo false 253,20,172,198,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0