const Web3 = require('web3')
const LuafarmAbi = require('./abis/LuafarmMaster.json')
const multicallAbi = require('./abis/Multicall.json')
const ERC20ABI = require('./abis/ERC20.json')
const { Interface } = require('@ethersproject/abi')
const lpTokenAddress = "0x88ba0bd9e1f90ccc21bdf7d33cb67fa5743da036";
const stakedAddress = "0x8Bcf7880d2Bae3E2705e7D90D28Bd417bd29020d";
var BN = Web3.utils.BN;
const BigNumber = require('bignumber.js')
const numeral = require('numeral')
const { formatUnits } = require('@ethersproject/units');

const network = '88'
const blockTag = 46351603 // 46351603 // 46741000 // 46265930
const addresses = []
const rpc = ''
const multicallAddress = ''
const graphUrl = ''

const axios = require('axios')
async function subgraphLuaswapRequest(url, query, options) {
    const res = await axios.post(
        url,
        query
    )
    return res.data.data
}
const formatNum = (number, format = '(0.[00]a)') => {
    if (number < 0.00001) return format.includes('%') ? '0%' : 0;
    return numeral(number).format(format);
  }


async function multicallLuaFarm(network, blockTag, calls) {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
    const multi = new web3.eth.Contract(multicallAbi.abi, multicallAddress);

    const itf = new Interface(LuafarmAbi.abi);

    try {
        const res = await multi.methods.aggregate(
            calls.map((call) => [
                call[0].toLowerCase(),
                itf.encodeFunctionData(call[1], call[2])
            ])
        ).call({}, blockTag);

        return res;
    } catch (e) {
        return Promise.reject(e);
    }
}
async function multicall (
    network,
    calls,
    blockTag
  ) {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
    const multi = new web3.eth.Contract(multicallAbi.abi, multicallAddress);
  
    const itf = new Interface(ERC20ABI);
  
    try {
      const res = await multi.methods.aggregate(
        calls.map((call) => [
          call[0].toLowerCase(),
          itf.encodeFunctionData(call[1], call[2])
        ])
      ).call({}, blockTag);
      return res;
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async function multicallTDAO (
    network,
    calls,
    blockTag
  ) {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
    const multi = new web3.eth.Contract(multicallAbi.abi, multicallAddress);
  
    const itf = new Interface(ERC20ABI);
  
    try {
      const res = await multi.methods.aggregate(
        calls.map((call) => [
          call[0].toLowerCase(),
          itf.encodeFunctionData(call[1], call[2])
        ])
      ).call({}, blockTag);
      return res;
    } catch (e) {
      return Promise.reject(e);
    }
  }
const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
const contract = new web3.eth.Contract(LuafarmAbi.abi, stakedAddress)

const run = async () => {
    try {
        const pairsInfo = await subgraphLuaswapRequest(
            graphUrl,
            {
                "operationName": "pairByAddress",
                "variables": {
                    "pairAddress": "0x88ba0bd9e1f90ccc21bdf7d33cb67fa5743da036",
                    "block": blockTag // 46351603 // 46741000
                },
                "query": "query pair($pairAddress: Bytes!, $block: Int!) {\n  pairs(where: {id: $pairAddress}, block: {number: $block}) {\n  id\n  reserve0\n  reserve1\n  reserveUSD\n  totalSupply\n  }\n}\n"
            }
        ); 
        console.log(JSON.stringify(pairsInfo))
        // block cu
        
        // const stakedBalance = data.amount
        
        // const stakedTDAO = new BigNumber(stakedBalance).multipliedBy(new BigNumber(pairsInfo.pairs[0].reserve0)).multipliedBy(new BigNumber(2)).div(new BigNumber(pairsInfo.pairs[0].totalSupply))
        // const a = stakedTDAO.div(10 ** 18).toString()
        // console.log(a)
        // console.log(formatNum(a))
        
        let stakedLPBalances = await multicallLuaFarm(
            network,
            blockTag,
            addresses.map((address) => [
                stakedAddress,
                'userInfo',
                [0, address]
            ])
        );
        // console.log('stakedLPBalances', stakedLPBalances);

        const lpBalances = await multicall(
            network,
            addresses.map((address) => [
                lpTokenAddress,
                'balanceOf',
                [address]
            ]),
            { blockTag }
        );
        // console.log('lpBalances', lpBalances);
        await stakedLPBalances.returnData.map(async (stakedBalance, index) => {
            const tDaoBalance = await multicall(
                network,
                addresses.map((address) => ['0x4EaafA85bDBe9B02930926C594F83e62B036B1be', 'balanceOf', [address]]),
                { blockTag }
              )
            // console.log('tDaoBalance', new BigNumber(tDaoBalance.returnData[index].substring(2, 66), 16).div(10 ** 18).toString())
        })

        let stakedTDAO = stakedLPBalances.returnData.map((stakedBalance, index) => {
            console.log('stakedBalance', new BigNumber(stakedBalance.substring(2, 66), 16).div(10 ** 18).toString())
            console.log('lpBalances', new BigNumber(lpBalances.returnData[index].substring(2, 66), 16).div(10 ** 18).toString())
            console.log('reserve0', new BigNumber(pairsInfo.pairs[0].reserve0).toString())
            console.log('totalSupply', new BigNumber(pairsInfo.pairs[0].totalSupply).toString())

            console.log('add  BN', new BN(lpBalances.returnData[index].substring(2, 66), 16).add(
                new BN(stakedBalance.substring(2, 66), 16)
                ).toString()
            )
            console.log('mul BN', new BN(lpBalances.returnData[index].substring(2, 66), 16).add(
                new BN(stakedBalance.substring(2, 66), 16)
                ).mul(
                    new BN(pairsInfo.pairs[0].reserve0)
                ).mul(
                    new BN(2)
                ).div(
                    new BN(pairsInfo.pairs[0].totalSupply)
                ).toString()
            )
            
            const h = new BigNumber(lpBalances.returnData[index].substring(2, 66), 16).plus(new BigNumber(stakedBalance.substring(2, 66), 16))
            console.log('add bignumber', 
                h.toString()
            )
            console.log('mul Bignumber reserve0',
                new BigNumber(h).multipliedBy(new BigNumber(pairsInfo.pairs[0].reserve0))
                .multipliedBy(new BigNumber(2))
                .div(new BigNumber(pairsInfo.pairs[0].totalSupply)).div(10 ** 18).toString()
            )

            // return (new BN(lpBalances.returnData[index].substring(2, 66), 16).add(
            //     new BN(stakedBalance.substring(2, 66), 16)
            // )).mul(
            //     new BN(pairsInfo.pairs[0].reserve0)
            // ).mul(
            //     new BN(2)
            // )
            // .div(
            //     new BN(pairsInfo.pairs[0].totalSupply)
            // ).toString()
            

            return new BigNumber(lpBalances.returnData[index].substring(2, 66), 16)
                .plus(new BigNumber(stakedBalance.substring(2, 66), 16))
                .multipliedBy(new BigNumber(pairsInfo.pairs[0].reserve0))
                .multipliedBy(new BigNumber(2))
                .div(new BigNumber(pairsInfo.pairs[0].totalSupply))
        });
        const q = Object.fromEntries(
            stakedTDAO.map((value, i) => [
                addresses[i],
                // parseFloat(new BigNumber(value).div(10 ** 18).toNumber())
                parseFloat(formatUnits(new BN(value.toString(10)).toString(), 18))
            ])
        );
        // console.log('stakedTDAO', q)
        return q
    } catch (error) {
        console.log(error)   
    }
}

run().then(data => console.log(data))

// console.log(formatNum(103078.72363435231))