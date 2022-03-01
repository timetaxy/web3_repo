const bufferlayout = require('buffer-layout')
const borsh = require("@project-serum/borsh")
const bs58 = require('bs58')
const util = require("util")

const a = {
    "type":"Buffer",
    "data":[0,20,0,0,0,84,104,101,32,73,110,102,117,103,105,98,108,101,115,32,35,49,48,51,53,3,0,0,0,84,73,70,92,0,0,0,104,116,116,112,115,58,47,47,98,97,102,121,98,101,105,103,116,108,53,105,55,116,108,115,51,100,111,53,106,117,110,51,122,117,105,98,108,121,113,115,110,122,119,118,113,119,54,104,99,118,116,99,105,111,119,51,109,108,112,99,103,113,112,108,101,103,121,46,105,112,102,115,46,100,119,101,98,46,108,105,110,107,47,49,48,51,53,46,106,115,111,110,32,3,1,5,0,0,0,73,249,92,89,47,247,117,148,45,106,26,9,137,75,125,239,0,167,29,250,131,143,107,85,19,150,71,44,124,245,224,45,1,0,6,65,156,6,69,48,246,214,66,103,66,217,59,252,205,155,71,130,219,39,90,159,10,158,105,79,210,149,191,206,251,237,0,10,127,3,255,231,95,67,209,6,92,22,116,136,95,47,234,84,254,43,162,145,74,115,121,67,198,68,9,81,101,247,22,73,0,20,125,196,226,135,253,165,249,150,31,62,106,73,17,221,12,119,147,211,60,205,48,170,112,180,52,21,107,104,44,170,104,90,0,30,231,167,142,197,61,146,17,101,190,109,130,190,9,174,7,94,198,147,31,19,31,3,119,152,142,165,94,69,201,165,13,244,0,40,1]
}


const dataSchema = [{
    "name": "name",
    "type": "string" 
}, {
    "name": "symbol",
    "type": "string" 
}, {
    "name": "uri",
    "type": "string" 
}, {
    "name": "sellerFeeBasisPoints",
    "type": "u16" 
}, {
    "name": "creatorAddress",
    "type": "publickey" 
}, {
    "name": "creatorVerified",
    "type": "i8" 
}, {
    "name": "share",
    "type": "i8" 
}, {
    "name": "isMutable",
    "type": "i8"
}]

const getSchemaData = (dataSchema, data) => {
    console.log('data', JSON.stringify(Buffer.from(data)))
    let params = {}

    let buffer = [borsh.u8('instruction')]
    for (let schema of dataSchema) {
        let newName = util.format("%s", schema.name)
        switch (schema.type) {
        case "i8":
            buffer.push(borsh.i8(newName))
            break
        case "u8":
            buffer.push(borsh.u8(newName))
            break
        case "u64":
            buffer.push(borsh.u64(newName))
            break
        case "u8_32":
            buffer.push(bufferlayout.seq(bufferlayout.u8(), 32, newName))
            break
        case "u8_5":
            buffer.push(borsh.array(borsh.u8(newName), 5, newName))
            // buffer.push(bufferlayout.seq(bufferlayout.u8(), 5, newName))
            break
        case "publickey":
            buffer.push(borsh.publicKey(newName))
            break
        case "vec_u8":
            buffer.push(borsh.vecU8(newName))
            break
        case "u32":
            buffer.push(borsh.u32(newName))
            break
        case "i64":
            buffer.push(borsh.i64(newName))
            break
        case "f64":
            buffer.push(bufferlayout.f64(newName))
            break
        case "string":
            buffer.push(borsh.str(newName))
            break
        case "u16":
            buffer.push(bufferlayout.u16(newName))
            break
        case "bool":
            buffer.push(bufferlayout.Boolean(newName))
            break
        case "option":
            buffer.push(borsh.option('bool', newName))
            break
        case "utf8":
            buffer.push(bufferlayout.utf8(newName))
            break
        case "vec":
            buffer.push(bufferlayout.struct([
                
            ]))
        }
    }
    console.log(buffer)

    const dataLayout = bufferlayout.struct(buffer)
    let layoutDecoded = dataLayout.decode(data)
    for (let key in layoutDecoded) {
        if (key === "instruction") {
            continue
        }
        let name = key
        let schema = dataSchema.find(e => e.name === name)
        let type = schema.type
        let postProcess = schema.postProcess
        if (postProcess) {
            params[name] = schema.postProcess(layoutDecoded[key])
            continue
        }

        if (type === "publickey") {
            params[name] = layoutDecoded[key].toString()
        } else if (type === "u8_32") {
            params[name] = beautyQuoteCurrency(layoutDecoded[key])
            continue
        } else if (type === "u64" || type === "i64" || type === "f64") {
            params[name] = layoutDecoded[key].toNumber()
        } else if (type === "rustEnum") {
            let keys = Object.keys(layoutDecoded[key])
            if (keys.length === 1) {
                params[name] = keys[0]
            }
        } else {
            if (typeof (layoutDecoded[key]) === "number") {
                params[name] = layoutDecoded[key]
            } else {
                params[name] = layoutDecoded[key].toString()
            }
        }
    }
    console.log('params', params)
    return params
}

const data = '1fKEfpXjJDvni2ipBTdjtACsTqLAGpdf2ePLw8RDEmMbqgZbeY7H52dzACpeBpj1ZDT2mTFxZS4iPJc521nFWvstC2n9BMtGqJVrszHthz97TEy2Wh8y8T3Ld7S8feaYbuHTiupSLGqTwFVpLqXwKYhRtrgjGvqYfyaD7MC2xVT9Ak6sPGQFPbtz6uu4JvkcYH3GiDFwyeisfTxiYCaWT6siaZtq6W5AZzEXwyMtmiRv4NBGy16WteC47HnRmLYe4ZiSaqAYUv6HPpveBqSLjyRmr6ArHKKRZqn7gaYHksxahFar28H8Vjw4d21XYYNKUWrN7HoYTsb7Cbgxd2pdoagP6azuVi7BpABpRk15nArFEBi51YF6zKSkonPjJ5kJSW4apCUB58teqWZyLJw7LPQnddPNS3pbr'

const bs58Data = bs58.decode(data)
console.log('bs58Data', bs58Data)

getSchemaData(dataSchema, bs58Data)