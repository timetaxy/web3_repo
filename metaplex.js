const { Connection, Account, programs } = require('@metaplex/js')

const web3 = require('@solana/web3.js')
const axios = require('axios').default
const borsh = require('borsh');
const bs58 = require('bs58')

const { metadata: { Metadata, MasterEdition } } = programs;
const network = 'https://api.mainnet-beta.solana.com' // conf.blockchain.network_backup
const METADATA_PREFIX = 'metadata';
const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
const MINT_KEY = "EMqCECjQLexyhdcMZjTsuxZRjD9yCJuS8VG1s76Rv7AE"

async function findProgramAddress(seeds, programId) {
    const key = 'pda-' + seeds.reduce((agg, item) => agg + item.toString('hex'), '') + programId.toString();
    const result = await web3.PublicKey.findProgramAddress(seeds, programId);
    return result[0].toString()
  
}

  const getNftMeta = async (mint) => {
    let result = await findProgramAddress([
    Buffer.from(METADATA_PREFIX),
    new web3.PublicKey(METADATA_PROGRAM_ID).toBuffer(),
    new web3.PublicKey(mint).toBuffer(),
    ], new web3.PublicKey(METADATA_PROGRAM_ID))
    
    const connection = new Connection(network)
    console.log('result', result)
    const metadata = await Metadata.load(connection, result);
    console.log('metadata', metadata)
    if (metadata !== null && metadata.data !== undefined){
        return metadata.data
    }
  }

  getNftMeta('4uy8exibsXtpaercH3UX9sWA5zioGeCZVMTgKQcpQr8L').then(data => console.log(JSON.stringify(data)))