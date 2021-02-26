const luaswapPrice = require('./price')

const Lua = require('./lua')


const PRIVATE_KEY = "45a59296bfdb8f88bcd1e99c28bc1b0e294e394062e6bad340b410c343781dd3"

const INFURA_KEY = "7883a7554949449c8e5462b20a3ff12b"

luaswapPrice.setInfuraKey(INFURA_KEY)

async function testSell () {
    // Test sell 5 tomo
    // let data
    // data = await luaswapPrice.getExecutionTradeOut(DAI_ADDRESS, DAI_DECIMAL, BAS_ADDRESS, BAS_DECIMAL, "10000000000000000000"),
    // console.log("selling TOMOE amount ", data.inputAmount.toSignificant(6))
    // console.log("selling Expect USDT amount ", data.outputAmount.toSignificant(6))
    // console.log("selling path ", data.route.path.map(token => token.address))
    
    // sell 4 TOMO
    // let lua = new Lua(PRIVATE_KEY, "https://mainnet.infura.io/v3/1c7781ad13f54fa8a315471249a75a4c")
    // let result = await lua.createOrder({
    //     side: "SELL",
    //     amount: "4",
    // })
    let lua = new Lua(PRIVATE_KEY, "https://mainnet.infura.io/v3/" + INFURA_KEY)
    let did_command_1 = false

    let interval = setInterval(async () => {
        let price = await lua.getPrice()
	    console.log("current price ", price)
        if (did_command_1 == false && parseFloat(price.bids[0].pricepoint) > 490 ) {
            did_command_1 = true
            console.log("buy 7 BAS price : ", price.bids[0].pricepoint)		
	    let result = await lua.createOrder({
                side: "SELL",
                amount: "15",
            })
            console.log(result)
        }
	
    }, 10000)
    // buy 4 TOMO
    
    // // await lua.approve("9999999999999999999", DAI_ADDRESS)
    // let result = await lua.createOrder({
    //     side: "SELL",
    //     amount: "0.01",
    // })
    // console.log(result)
    // let tx = await lua.extractSwapInfo("0x6550c422215a73820b848f3495b0297f67cc75365e0eadd2c54660c45330ec92")
    // console.log(tx)
    // setInterval(async() => {
    //     console.log(await lua.getPrice())
    // }, 10000)
        
    
    
}

testSell()

module.exports = Lua
