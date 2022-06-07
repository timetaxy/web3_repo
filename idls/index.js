
const AnchorPrograms = {
    "22Y43yTVxuUkoRKdm9thyRhQ3SdgQS7c7kB6UNCiaczD": { idl: require('./idl_serum_swap.json'), name: 'serum swap'}, //Serum swap
    "Crt7UoUR6QgrFrN7j8rmSQpUTNWNSitSwWvsWGf1qZ5t": { idl: require('./idl_saber.json'), name: 'saber' }, //SaberRouter
    "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD": { idl: require('./idl_marinade.json'), name: 'marinade' }, //Marinade Finance
    "cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ": { idl: require('./idl_metaplex_nft _cndy_machine_v1.json'), name: 'metaplex nft candy machine v1 '}, //Metaplex NFT Candy Machine v1
    // bug "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ": { idl: require('./idl_metaplex_cndy.json'), name: 'metaplex candy machine v2' }, //Metaplex candy machine v2 * https://github.com/metaplex-foundation/metaplex-program-library/blob/master/candy-machine/js/idl/candy_machine.json
    "CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb": { idl: require('./idl_metaplex_cndy.json'), name: 'metaplex candy machine v1 '}, // Metaplex nft candy machine - downloaded
    "JUP6i4ozu5ydDCnLiMogSckDPpbtr7BJ4FtzYWkb5Rk": { idl: require('./idl_jupiter_v1.json'), name: 'jupiter aggregator v1' }, //Jupiter Aggregator v1
    "JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo": { idl: require('./idl_jupiter_v2.json'), name: 'jupiter aggregator v2' },  //Jupiter Aggregator v2
    "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD": { idl: require('./idl_zeta.json'), name: 'zeta' },   //Zeta DEX
    "7t8zVJtPCFAqog1DcnB6Ku1AVKtWfHkCiPi1cAvcJyVF": { idl: require('./idl_digitaleye_sell.json'), name: 'digitaleyes' },  //DigitalEyes Direct Sell
    "Zo1ggzTUKMY5bYnDvT5mtVeZxzf2FaLTbKkmvGUhUQk": { idl: require('./idl_01protocol.json'), name: '01 protocol' }, // 01protocol 01.xyz
    "BHJ4tRcogS88tUhYotPfYWDjR4q7MGdizdiguY3N54rb": { idl: require('./idl_dispatch.json'), name: 'dispatch protocol' }, //Dispatch Protocol
    "cysPXAjehMpVKUapzbMCCnpFxUFFryEWEaLgnb9NrR8": { idl: require('./idl_cyclos.json'), name: 'cykura' }, // Cyclos - cykura - https://github.com/cykura/sdk/blob/main/src/anchor/idl/cyclos_core.json
    "HubbLeXBb7qyLHt3x7gvYaRrxQmmgExb7fCJgDqFuB6T": { idl: require('./idl_hubble.json'), name: 'hubble protocol' }, // Hubble protocol - https://github.com/hubbleprotocol/hubble-common/blob/master/packages/hubble-idl/src/borrowing.json
    "TLPv2tuSVvn3fSk8RgW3yPddkp5oFivzZV3rA9hQxtX": { idl: require('./idl_solfarm_tulip.json'), name: 'tulip' }, // solfarm - tulip, https://github.com/sol-farm/solfarm-sdk/blob/main/constants/vaults_v2_idl.json
    "5TeGDBaMNPc2uxvx6YLDycsoxFnBuqierPt3a8Bk4xFX": { idl: require('./idl_synthetify.json'), name: 'synthetify' }, // synthetify https://github.com/Synthetify/synthetify-protocol/blob/master/sdk/src/idl/exchange.ts
    "QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto": { idl: require('./idl_quarry_merge_mine.json'), name: 'quarry merge mine' }, // quarry merge mine - downloaded
    "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB": { idl: require('./idl_quarry_mine.json'), name: 'quarry mine' }, // quarry mine - downloaded
    "QoP6NfrQbaGnccXQrMLUkog2tQZ4C1RFgJcwDnT8Kmz": { idl: require('./idl_quarry_operator.json'), name: 'quarry operator' }, // quarry operator - downloaded
    "QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9": { idl: require('./idl_quarry_redeemer.json'), name: 'quarry redeemer' }, // quarry redeemer - downloaded
    "QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc": { idl: require('./idl_quarry_registry.json'), name: 'quarry registry' }, // quarry registry - downloaded
    "QMWoBmAyJLAsA1Lh9ugMTw2gciTihncciphzdNzdZYV": { idl: require('./idl_quarry_mine_wrapper.json'), name: 'quarry mine wrapper' }, // quarry wrapper
    "G8m1KG1Po42eTPaQBVkU486sVAYU4hKwaueBPCe4Nrm4": { idl: require('./idl_aldrin_dtwap.json'), name: 'aldrin dtwap' }, // aldrin dtwap - downloaded
    "CURVGoZn8zycx6FXwwevgBTB2gVvdbGTEpvMJDbgs2t4": { idl: require('./idl_aldrin_pools_v2.json'), name: 'aldrin pool v2' }, // aldrin pool v2 - https://github.com/aldrin-exchange/aldrin-sdk/blob/f3bdfdab34287ddf9c1fd762e9339ed8d30a1c79/src/idl
    "AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6": { idl: require('./idl_aldrin_pool_v1.json'), name: 'aldrin dtwap' }, // aldrin pool v1 https://github.com/aldrin-exchange/aldrin-sdk/blob/f3bdfdab34287ddf9c1fd762e9339ed8d30a1c79/src/idl
    "dammHkt7jmytvbS3nHTxQNEcP59aE57nxwV21YdqEDN": { idl: require('./idl_drift_clearing_house.json'), name: 'drift clearing house' }, // driff clearing house - https://github.com/drift-labs/protocol-v1/blob/master/sdk/src/idl/clearing_house.json
    "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f": { idl: require('./idl_switchboardV2.json'), name: 'switchboard v2' }, // switchboard v2
    "JPLockxtkngHkaQT5AuRYow3HyUv5qWzmhwsCPd653n": { idl: require('./idl_jet_staking.json'), name: 'jet staking' }, // jet staking https://github.com/jet-lab/jet-engine/blob/master/src/staking/idl.ts
    "JET777rQuPU8BatFbhp6irc1NAbozxTheBqNo25eLQP": { idl: require('./idl_jet_rewards.json'), name: 'jet rewards' }, // jet rewards https://github.com/jet-lab/jet-engine/blob/master/src/rewards/idl.ts
    "JPv1rCqrhagNNmJVM5J1he7msQ5ybtvE1nNuHpDHMNU": { idl: require('./idl_jet_pool.json'), name: 'jet pool' }, // jet pool https://github.com/jet-lab/jet-engine/blob/master/src/pools/idl.ts
    "ARoWLTBWoWrKMvxEiaE2EH9DrWyV7mLpKywGDWxBGeq9": { idl: require('./idl_arrow_sunny.json'), name: 'arrow sunny' }, // arrow sunny https://github.com/arrowprotocol/arrow/blob/master/src/sunny.ts
    // HajXYaDXmohtq2ZxZ6QVNEpqNn1T53Zc9FnR1CnaNnUf parrot finance
    // cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ Metaplex candy machine v2
    // solend
    // fabric
    // R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs psyoption american
    // sosol
    "4Q6WW2ouZ6V3iaNm56MTd5n2tnTm4C5fiH8miFHnAFHo": { idl: require('./idl_mango_voter_stake.json'), name: 'mango voter stake' } // https://github.com/blockworks-foundation/voter-stake-registry/blob/master/src/voter_stake_registry.ts
}
module.exports =  AnchorPrograms
