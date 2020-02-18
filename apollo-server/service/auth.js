const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') //see: https://github.com/auth0/node-jsonwebtoken
const config = require('../config')
const generate_id = require('../utils/unique_id')
const shortid = require('shortid')

const salt_rounds = 5

function generate_tokens(payload) {
  //TODO: we should involve some mechanism to 'logout' the long live refresh_token
  const refresh_token = jwt.sign(payload, config.jwt.secret)
  //access token will be expired in 1 hour
  const access_token = generate_access_token(payload)
  return { refresh_token, access_token }
}

function generate_access_token(payload) {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: 60 * 60 })
}

function verify_token(token) {
  return jwt.verify(token, config.jwt.secret)
}

class AuthService {
  constructor({ db }) {
    this.db = db
  }

  signup(input) {
    const db = this.db
    // 判断账户是否存在
    let isHave = db
      .get('users')
      .find({ userNo: input.userNo })
      .value()
    if (isHave) {
      throw new Error('账号已经添加过了')
    }
    return bcrypt
      .hash(input.passWord + '', salt_rounds)
      .then(hashed_password => {
        input.passWord = hashed_password
        const user = {
          id: shortid.generate(),
          ...input
        }
        return db
          .get('users')
          .push(user)
          .last()
          .write()
      })
      .catch(err => {
        console.log(err)
        throw new Error('新增用户错误')
      })
  }

  signin(userNo, passWord) {
    let db = this.db
    let result = db
      .get('users')
      .find({ userNo: userNo })
      .value()
    return bcrypt.compare(passWord, result.passWord).then(res => {
      if (res) {
        return generate_tokens({
          id: result.id,
          name: result.name,
          userNo: result.userNo,
          isAdmin: result.isAdmin
        })
      } else {
        throw new Error('用户名密码错误')
      }
    })
  }

  authenticate(access_token) {
    return verify_token(access_token)
  }

  refresh(refresh_token) {
    return generate_access_token(verify_token(refresh_token))
  }
}

module.exports = AuthService
