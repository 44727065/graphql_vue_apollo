import GraphQLJSON from 'graphql-type-json'
import shortid from 'shortid'
import { db } from './utils/db'
import AuthService from './service/auth'
const auth = new AuthService({ db: db })
export default {
  JSON: GraphQLJSON,

  Counter: {
    countStr: counter => `Current count: ${counter.count}`
  },

  Query: {
    hello: (root, { name }) => `Hello ${name || 'World'}!`,
    messages: (root, args, { db }) => db.get('messages').value(),
    uploads: (root, args, { db }) => db.get('uploads').value(),
    // 查询出所有的周报
    weeklys: (root, { userNo }, { db }) => {
      if (!userNo) {
        return db.get('weeklys').value()
      } else {
        let res = db
          .get('weeklys')
          .filter({ userNo })
          .value()
        return res
      }
    },
    // 查询单个用户
    singleUser(root, args, context) {
      let db = context.db
      // 查看非自己用户
      // 传过来的参数 userNo
      let userNoParam = args.userNo
      if (userNoParam) {
        return db
          .get('users')
          .filter({ userNo: userNoParam })
          .value()
      }

      let userNo = context.userNo
      if (!userNo) throw new Error('请登录')
      let res = db
        .get('users')
        .filter({ userNo: userNo })
        .value()
      return res
    },
    users(root, ignore, { db, isAdmin }) {
      if (!isAdmin) throw new Error('非管理员，不可查看')
      return db.get('users').value()
    }
  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = 'My mutation completed!'
      context.pubsub.publish('hey', { mySub: message })
      return message
    },

    addMessage: (root, { input }, { pubsub, db }) => {
      const message = {
        id: shortid.generate(),
        text: input.text
      }

      db.get('messages')
        .push(message)
        .last()
        .write()

      pubsub.publish('messages', { messageAdded: message })

      return message
    },
    // 增加周报
    addWeek(root, { input }, { pubsub, db }) {
      const weekly = {
        id: shortid.generate(),
        ...input
      }

      db.get('weeklys')
        .push(weekly)
        .last()
        .write()
      // pubsub.publish('weekly', { weeklyAdded: weekly })

      return weekly
    },

    // 用户登录
    userLogin(root, { userNo, passWord }, { pubsub, db }) {
      if (!userNo || !passWord) return new Error('用户名密码不能为空')
      return auth.signin(userNo, passWord)
    },
    // 新增用户
    addUser(root, { input }, { pubsub, db }) {
      return auth.signup(input)
    },
    // 修改用户
    editUser(root, { input }, { pubsub, db }) {
      // 写入内容
      let user = {
        id: input.id,
        ...input.item
      }
      db.get('users')
        .find({ id: user.id })
        .assign(user)
        .write()

      return user
    },
    // 删除用户
    removeUser(root, { userNo }, { pubsub, db }) {
      let res = db
        .get('users')
        .remove({ userNo: userNo })
        .write()
      if (res) {
        return `工号：${res.userNo}，姓名：${res.userNo} 删除成功！`
      } else {
        return null
      }
    },

    singleUpload: (root, { file }, { processUpload }) => processUpload(file),
    multipleUpload: (root, { files }, { processUpload }) => Promise.all(files.map(processUpload))
  },

  Subscription: {
    mySub: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('hey')
    },
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random()
          .toString(36)
          .substring(2, 15) // random channel name
        let count = 0
        setInterval(
          () =>
            pubsub.publish(channel, {
              // eslint-disable-next-line no-plusplus
              counter: { count: count++ }
            }),
          2000
        )
        return pubsub.asyncIterator(channel)
      }
    },

    messageAdded: {
      subscribe: (parent, args, { pubsub }) => {
        console.log('到达订阅部分')
        return pubsub.asyncIterator('messages')
      }
    }
    // weeklyAdded: {
    //   subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('weeklys')
    // }
  }
}
