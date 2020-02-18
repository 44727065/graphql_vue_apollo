<template>
  <div>
    <div>所有人的信息</div>
    <ul>
      <li v-for="item in users" :key="item.id">工号：{{ item.userNo }} 姓名：{{ item.name }} 类型：{{ item.isAdmin ? '管理员' : '员工' }} <a href="#" @click="toedit(item.userNo)">编辑</a> <a href="#" @click="remove(item.userNo)">删除</a></li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  data() {
    return {
      users: []
    }
  },
  methods: {
    async getuser() {
      try {
        await this.$apollo.mutate({
          mutation: require('../../graphql/Users.gql'),
          update: (store, { data }) => {
            this.users = data.users
          }
        })
      } catch (e) {
        alert(e)
      }
    },
    toedit(userNo) {
      this.$router.push({
        path: '/user/profile',
        query: {
          userNo
        }
      })
    },
    async remove(userNo) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation removeUser($userNo: String!) {
              removeUser(userNo: $userNo) {
                id
                userNo
                name
                isAdmin
              }
            }
          `,
          variables: {
            userNo: userNo
          },
          update(store, data) {
            console.log(data)
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.getuser()
  }
}
</script>

<style></style>
