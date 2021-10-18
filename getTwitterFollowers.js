const file = require('./twitter.json')
const axios = require('axios')
const urljoin = require('url-join')
const fs = require('fs')
let user = Array.isArray(file) ? file : []

const token = '???'

const sleep = (ms) => {
   return new Promise(resolve => setTimeout(resolve, ms));
}

let sleepCounter = 0
const run = async () => {
    const urlv1 = 'https://api.twitter.com/1.1/followers/list.json?screen_name=TomoChainANN'

    const urlv2 = 'https://api.twitter.com/2/users/933165746653245441/followers'

    let cursor = 'UQ7RJ2U7BFOHCZZZ'
    try {
        do {
            console.log('cursor', cursor)
            console.log('length', user.length)
            const { data } = await axios.get(
                urljoin(
                    urlv2,
                    '?max_results=1000',
                    `${cursor !== -1 ? `&pagination_token=${cursor}` : ''}`
                ), {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            user = user.concat(data.data)
            cursor = data.meta.next_token

            if (sleepCounter >= 14) {
                await sleep(16 * 1000 * 60) // 16 minutes
            } else {
                sleepCounter++
            }
        }
        while (cursor !== 0 || user.length >= 6000)
        fs.writeFileSync('twitter.json', JSON.stringify(user, null, 2))
    } catch (error) {
        fs.writeFileSync('twitter.json', JSON.stringify(user, null, 2))
        console.log(error.response.data)
    }
}

run()
