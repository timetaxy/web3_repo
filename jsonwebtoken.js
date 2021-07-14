const jwt = require('jsonwebtoken')

const JWT_SECRET = '$2a$10$zMv2skn0DWEfsZGG91rC/O'

const tokenDecoding = async function (token) {
    let infor
    try {
        infor = jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return { error: { message: 'Token expired' } }
    }
    console.log(infor)

    return infor
}

const generateToken = async function (user, action = '') {
    let payload, options, token

    if (!user) { return false }

    switch (action) {
    case 'confirmRegister':
        payload = {
            id: user._id,
            email: user.email,
            action: 'confirmRegister'
        }
        options = {
            expiresIn: '2h' // 2 hours for resetting password
        }
        token = jwt.sign(payload, JWT_SECRET, options)

        return token || false

    case 'resetPwd':
        payload = {
            id: user._id,
            email: user.email,
            action: 'resetPwd'
        }
        options = {
            expiresIn: '2h' // 2 hours for resetting password
        }
        token = jwt.sign(payload, JWT_SECRET, options)

        return token || false

    case '':
        payload = {
            id: user._id,
            email: user.email
        }

        options = {
            expiresIn: 10800 * 1000
        }
        token = jwt.sign(payload, JWT_SECRET, options)

        return token ? `Bearer ${token}` : false
    default:
        break
    }
}

// console.log(tokenDecoding('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZWJmZmE2MmExMTA3NmUyNzFkMTNkMCIsImVtYWlsIjoicHF2MTk5eEBnbWFpbC5jb20iLCJhY3Rpb24iOiJjb25maXJtUmVnaXN0ZXIiLCJpYXQiOjE2MjYxNjA3NzIsImV4cCI6MTYyNjE2Nzk3Mn0.JToi4ILFVJ0QrCSJYrItlSqGHppJ1YlqN30C-wsP3IE'))

console.log(generateToken({
    email: 'abc1234@yopmail.com',
    _id: '60ed42fe1511f2692c2f9e33'
}, 'confirmRegister'))