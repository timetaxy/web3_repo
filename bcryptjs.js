const bcrypt = require('bcryptjs')

const APP_SECRET = '123456789'

const encryptPassword = async function (password) {
    const hash = await bcrypt.hash(password, APP_SECRET)

    return hash
}