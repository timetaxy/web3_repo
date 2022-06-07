const anchor = require('@project-serum/anchor')
const web3 = require("@solana/web3.js")
const bs58 = require('bs58')
const idl = require('./idls/idl_aldrin_dtwap.json')

const ALLOW_PROGRAM = [
    "22Y43yTVxuUkoRKdm9thyRhQ3SdgQS7c7kB6UNCiaczD", //Serum swap - https://github.com/project-serum/serum-ts/blob/master/packages/swap/src/idl.ts
    "Crt7UoUR6QgrFrN7j8rmSQpUTNWNSitSwWvsWGf1qZ5t", //SaberRouter - downloaded
    "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD", //Marinade Finance - downloaded
    "cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ", //Metaplex NFT Candy Machine v1
    // "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ", //Metaplex candy machine v2 * https://github.com/metaplex-foundation/metaplex-program-library/blob/master/candy-machine/js/idl/candy_machine.json
    "CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb", // Metaplex nft candy machine - downloaded
    "JUP6i4ozu5ydDCnLiMogSckDPpbtr7BJ4FtzYWkb5Rk", //Jupiter Aggregator v1 - downloaded
    "JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo",  //Jupiter Aggregator v2 - https://github.com/jup-ag/instruction-parser/blob/main/src/idl/jupiter.ts
    "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD",   //Zeta DEX - https://github.com/zetamarkets/sdk/blob/main/src/idl/zeta.json
    "7t8zVJtPCFAqog1DcnB6Ku1AVKtWfHkCiPi1cAvcJyVF",  //DigitalEyes Direct Sell - downloaded
    "Zo1ggzTUKMY5bYnDvT5mtVeZxzf2FaLTbKkmvGUhUQk", // 01protocol 01.xyz - https://github.com/01protocol/zo-sdk-py/blob/master/zo/idl.json
    "BHJ4tRcogS88tUhYotPfYWDjR4q7MGdizdiguY3N54rb", //Dispatch Protocol - downloaded
    "cysPXAjehMpVKUapzbMCCnpFxUFFryEWEaLgnb9NrR8", // Cyclos - cykura - https://github.com/cykura/sdk/blob/main/src/anchor/idl/cyclos_core.json
    "HubbLeXBb7qyLHt3x7gvYaRrxQmmgExb7fCJgDqFuB6T", // Hubble protocol - https://github.com/hubbleprotocol/hubble-common/blob/master/packages/hubble-idl/src/borrowing.json
    "TLPv2tuSVvn3fSk8RgW3yPddkp5oFivzZV3rA9hQxtX", // solfarm - tulip, https://github.com/sol-farm/solfarm-sdk/blob/main/constants/vaults_v2_idl.json
    "5TeGDBaMNPc2uxvx6YLDycsoxFnBuqierPt3a8Bk4xFX", // synthetify https://github.com/Synthetify/synthetify-protocol/blob/master/sdk/src/idl/exchange.ts
    // "7vxeyaXGLqcp66fFShqUdHxdacp4k4kwUpRSSeoZLCZ4", // solfarm-tulip-raydium vault https://github.com/sol-farm/solfarm-sdk/blob/main/constants/raydium_idl.json
    // "HajXYaDXmohtq2ZxZ6QVNEpqNn1T53Zc9FnR1CnaNnUf", // parrot finance - https://github.com/gopartyparrot/parrot-sdk/blob/master/packages/core/src/configs/config.prod.json
    "QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto", // quarry merge mine - downloaded
    "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB", // quarry mine - downloaded
    "QoP6NfrQbaGnccXQrMLUkog2tQZ4C1RFgJcwDnT8Kmz", // quarry operator - downloaded
    "QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9", // quarry redeemer - downloaded
    "QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc", // quarry registry - downloaded
    "G8m1KG1Po42eTPaQBVkU486sVAYU4hKwaueBPCe4Nrm4", // aldrin dtwap - https://github.com/aldrin-exchange/aldrin-sdk/blob/f3bdfdab34287ddf9c1fd762e9339ed8d30a1c79/src/idl
    "CURVGoZn8zycx6FXwwevgBTB2gVvdbGTEpvMJDbgs2t4", // aldrin pool v2 - https://github.com/aldrin-exchange/aldrin-sdk/blob/f3bdfdab34287ddf9c1fd762e9339ed8d30a1c79/src/idl
    "AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6", // aldrin pool v1 https://github.com/aldrin-exchange/aldrin-sdk/blob/f3bdfdab34287ddf9c1fd762e9339ed8d30a1c79/src/idl
    // solend
    "dammHkt7jmytvbS3nHTxQNEcP59aE57nxwV21YdqEDN", // driff clearing house - https://github.com/drift-labs/protocol-v1/blob/master/sdk/src/idl/clearing_house.json
    "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f", // switchboard v2
    // fabric
    "JPLockxtkngHkaQT5AuRYow3HyUv5qWzmhwsCPd653n", // jet staking https://github.com/jet-lab/jet-engine/blob/master/src/staking/idl.ts
    "JET777rQuPU8BatFbhp6irc1NAbozxTheBqNo25eLQP", // jet rewards https://github.com/jet-lab/jet-engine/blob/master/src/rewards/idl.ts
    "JPv1rCqrhagNNmJVM5J1he7msQ5ybtvE1nNuHpDHMNU", // jet pool https://github.com/jet-lab/jet-engine/blob/master/src/pools/idl.ts
    // "R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs", // psyoption american https://github.com/mithraiclabs/psyoptions-ts/blob/78e7276445f1a709920d5bed7758d4d6e2c6f651/packages/psy-american/src/idl.json
    // sosol
    "ARoWLTBWoWrKMvxEiaE2EH9DrWyV7mLpKywGDWxBGeq9", // arrow sunny https://github.com/arrowprotocol/arrow/blob/master/src/sunny.ts
    
]
let cacheAnchorProgram = {}

const keys = [
    "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    "Dxgo5DbgoSpoK9bqBBizr9G4BHkZedDY1WoKFGGSNMiQ",
    "7b2fUJrCX7WNp9GHkayob6wuwmEkuZQeFxb7tvX3os2W",
    "8mYsUtkQEwmThJ2JpayYH8aTZ3AKyLSEgzUxBzTtWBd",
    "CeXr5nsmfsM86NwH7xCpNqecyRpSbtBhTxszMSyG7SAa",
    "6jwdEwrnKp5xymxW5eu4BmvEMNPFx47EhcfmPiKvAt6L",
    "AyjszL8JcM9AXw9QbeScx2orD1bDmerWcGCQRhTu9RxD",
    "7JbaETQenFwSFB1y4ty9jUjfsKJ828MQ7WtzWUtBSoRW",
    "HiaSrveQB4tkePqRGuVQNekvEaarbVFmnrFz58GFtAfn",
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    "CzuipkNnvG4JaTQPjgAseWLNhLZFYxMcYpd2G8hDLHco"
]
const run = async () => {
    let type = 'unknown', accounts = {}
    try {
        const connection = new web3.Connection("https://explorer-api.mainnet-beta.solana.com")
        let provider = new anchor.AnchorProvider(connection, {}, {})
        // console.log(anchor)
        // console.log(anchor)
        const anchorProgram = new anchor.Program(idl, "mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68", provider)
        // console.log(anchorProgram)
        const anchorProgram1 = await anchor.Program.at("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin", provider)
        console.log(JSON.stringify(anchorProgram1._coder))
        // console.log(bs58.decode('b2hWfRaGwpi')[0])
        type = anchorProgram.coder.instruction.decode(bs58.decode('WJPy1qqE2HtvfTLyQbxfMuSs1oN6uwtzwFncNCJ8WvyfyTWk3nom1pE7LKZ91Rr5pqTc'))
        console.log(type)
        if (type) {
            const accountKeys = keys.map(i => ({
                pubkey: i,
                isSigner: false,
                isWritable: false,
            }))
            let parsed = anchorProgram.coder.instruction.format(type, accountKeys)
            if (parsed) {
                parsed.accounts.forEach((i, index) => {
                    if (i.name) {
                        accounts[i.name] = i.pubkey
                    }
                });
            }
            const parsedAccounts = Object.values(accounts) || []
            accountKeys.map((i, index) => {
                if (parsedAccounts.indexOf(i.pubkey) < 0) {
                    accounts[`Account${index + 1}`] = i.pubkey
                }
            })
            parsed.args.forEach((i, index) => {
                if (i.name) {
                    accounts[i.name] = i.data
                }
            })
        } else {

        }
        
        // const a = await Promise.all(ALLOW_PROGRAM.map(async programId => {
        //     cacheAnchorProgram[programId] = await anchor.Program.at(programId, provider)
        // }))

    } catch (error) {
        console.log(error)
    }
    console.log(type.name, accounts)
}

run()