const axios = require('axios')

async function run () {
    const closingPrice = 1.216
    const highestPrice = 2500

    const url = 'https://ido-api-mainnet.gnosis.io/api/v1/get_order_book_display_data/13'

    const set1 = new Map()

    const {data} = await axios.get(url)
    let totalToken = 0
    let totalUsdt = 0
    data.bids.map(r => {
        const toFixedNum3 = Number(r.price).toFixed(3)
        const toFixedNum2 = Number(r.price).toFixed(2)
        if (toFixedNum3 >= closingPrice && toFixedNum3 <= highestPrice) {
            if (!set1.get(toFixedNum3)) {

                // price
                // volume: amount of usdt
                set1.set(toFixedNum3, { usdt: r.volume, amount: (r.volume / r.price) })
            } else {
                set1.set(toFixedNum3, {
                    usdt: set1.get(toFixedNum3).usdt + r.volume,
                    amount: set1.get(toFixedNum3).amount + (r.volume / r.price)
                })
            }
            totalToken += r.volume
            totalUsdt += r.volume
        }

    })

    console.log(set1)
    console.log('total token sold', totalToken / closingPrice)
    console.log('total usdt', totalUsdt)
}

run()

// console.log(Number(1.4999999999999998).toFixed(3))
