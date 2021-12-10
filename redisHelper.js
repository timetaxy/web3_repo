const redis = require("redis");
const client = redis.createClient();
const util = require('util')

const DEFAULT_EXPIRY_TIME = 60 * 60 * 6 // 6 hours

const redisHelper = {
    set: async (name, value, expiry = null) => {
        // will expiry in 1 hours if not set expiry time
        // await client.set(name, value)
        if (expiry) {
            await client.set(name, value, 'EX', expiry)
        } else {
            await client.set(name, value, 'EX', DEFAULT_EXPIRY_TIME)
        }
    },
    get: async (name) => {
        const getAsync = util.promisify(client.get).bind(client)
        return getAsync(name)
    },
    remainingTime: async (name) => {
        const getAsync = util.promisify(client.ttl).bind(client)
        return getAsync(name)
    },
    delete: async (name) => {
        await client.del(name)
    }
}
module.exports = redisHelper