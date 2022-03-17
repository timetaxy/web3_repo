const {
	Connection,
	Account,
	programs
} = require('@metaplex/js')

const web3 = require('@solana/web3.js')
const axios = require('axios')
const borsh = require('borsh');
const bs58 = require('bs58')

const {
	metadata: {
		Metadata,
		MasterEdition
	}
} = programs;
const network = 'https://api.mainnet-beta.solana.com' // conf.blockchain.network_backup
const METADATA_PREFIX = 'metadata';
const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
const MINT_KEY = "EMqCECjQLexyhdcMZjTsuxZRjD9yCJuS8VG1s76Rv7AE"


const metadata = {
	async findProgramAddress(seeds, programId) {
		const key = 'pda-' + seeds.reduce((agg, item) => agg + item.toString('hex'), '') + programId.toString();
		const result = await web3.PublicKey.findProgramAddress(seeds, programId);
		return result[0].toString()
	
	},
	async getEdition(mint) {
		try {
			const connection = new Connection(network)
			const edition = await Metadata.getEdition(connection, mint);
			if (edition.constructor.name === 'MasterEdition') {
				if (edition.data !== undefined && edition.data !== null) {
					let master = {
						type: 'MasterEdition'
					}
					if (edition.data['maxSupply'] !== undefined) {
						master['maxSupply'] = edition.data['maxSupply'].toString()
					}
					if (edition.data['supply'] !== undefined) {
						master['supply'] = edition.data['supply'].toString()
					}
					return master
				}
			}
	
			if (edition.constructor.name === 'Edition') {
				if (edition.data !== undefined && edition.data !== null) {
					let editionRes = {
						type: 'Edition'
					}
					if (edition.data['edition'] !== undefined) {
						editionRes['edition'] = edition.data['edition'].toString()
					}
					if (edition.data['parent'] !== undefined) {
						let parentEdition = await MasterEdition.getInfos(connection, edition.data['parent'])
						console.log(parentEdition)
						if (parentEdition.data['supply'] !== undefined) {
							editionRes['supply'] = parentEdition.data['supply'].toString()
						}
	
					}
					return editionRes
				}
			}
	
		} catch (error) {
			console.log(error)
		}
		return null
	},
	async getNftMeta (mint, isMetadataAcc = false) {
		let result = isMetadataAcc ?
			mint :
			await this.findProgramAddress([
				Buffer.from(METADATA_PREFIX),
				new web3.PublicKey(METADATA_PROGRAM_ID).toBuffer(),
				new web3.PublicKey(mint).toBuffer(),
			], new web3.PublicKey(METADATA_PROGRAM_ID))
		// console.log('result', result)
	
		const connection = new Connection(network)
		const metadata = await Metadata.load(connection, result);
		console.log(metadata)
		if (metadata !== null && metadata.data !== undefined) {
			return metadata.data
		}
	},
	async downloadMetadata (url) {
        try {
            const { data } = await axios.get(url)
            return data
        } catch (error) {
            console.log('metaplex downloadMetadata error' + error.toString())
			return {}
        }
    }
}

// EAtQ5KhuFmhqJU3XJZbLvB34bnNysJXA7jFA1gDCpYuk
metadata.getNftMeta('EAtQ5KhuFmhqJU3XJZbLvB34bnNysJXA7jFA1gDCpYuk').then(data => console.log(JSON.stringify(data, null, 2)))
metadata.getEdition('EAtQ5KhuFmhqJU3XJZbLvB34bnNysJXA7jFA1gDCpYuk').then(data => console.log(JSON.stringify(data, null, 2)))
// metadata.downloadMetadata('').then(data => console.log(data))