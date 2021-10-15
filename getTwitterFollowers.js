const file = require('./file.json')
const axios = require('axios')
const urljoin = require('url-join')
const fs = require('fs')
let user = []
const run = async () => {
    const url = 'https://api.twitter.com/1.1/followers/list.json?screen_name=sodapoppin'

    let cursor = -1
    try {
        do {
            console.log('cursor', cursor)
            console.log('length', user.length)
            const { data } = await axios.get(
                urljoin(
                    url,
                    '&count=200',
                    `&cursor=${cursor}`
                ), {
                    headers: {
                        'Authorization': 'Bearer token'
                    }
                }
            )
            user = user.concat(data.users)
            cursor = data.next_cursor
        }
        while (cursor !== 0 || user.length <= 6000)
        fs.writeFileSync('twitter.json', user)
    } catch (error) {
        console.log(error.data)
    }
}

run()
