import { db } from './utils/db'
import { processUpload } from './utils/upload'
// import users from './connectors/users'
import AuthService from './service/auth'
// import isJsonString from './utils/isJsonString'
const auth = new AuthService({ db: db })
// Context passed to all resolvers (third argument)
// req => Query
// connection => Subscription
// eslint-disable-next-line no-unused-vars
export default ({ req, connection }) => {
  // If the websocket context was already resolved
  if (connection && connection.context) return connection.context

  let token
  // HTTP
  if (req) token = req.get('Authorization')
  // Websocket
  if (connection) token = connection.authorization
  token = token && token.replace('Bearer ', '').trim()
  let access_token = ''
  let userNo = ''
  let isAdmin = false
  let name = ''
  // 如果可转
  // if (token && isJsonString(token)) {
  //   console.log('对象里面有没有东西', JSON.parse(token).access_token, typeof token)
  //   let decodeInfo = auth.authenticate(JSON.parse(token).access_token)
  //   access_token = JSON.parse(token).access_token
  //   userNo = decodeInfo.userNo
  //   isAdmin = decodeInfo.isAdmin
  //   name = decodeInfo.name
  // }
  if (token) {
    let decodeInfo
    try {
      decodeInfo = auth.authenticate(token)
    } catch (err) {
      console.log(err)
      decodeInfo = {}
    }
    access_token = token
    userNo = decodeInfo.userNo
    isAdmin = decodeInfo.isAdmin
    name = decodeInfo.name
  }
  // User validation

  return {
    access_token,
    userNo,
    isAdmin,
    name,
    db,
    processUpload
  }
}
