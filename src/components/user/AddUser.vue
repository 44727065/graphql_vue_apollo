<template>
  <div>
    <div>添加账号</div>
    <div>
      <div><label>工号</label><input v-model="userNo" /></div>
      <div><label>姓名</label><input v-model="name" /></div>
      <div><label>密码</label><input v-model="passWord" /></div>
      <div>
        <label>管理员</label>
        <input type="radio" id="wuhan" :value="true" v-model="isAdmin" />
        <label for="wuhan">管理员</label>
        <input type="radio" id="user" :value="false" v-model="isAdmin" />
        <label for="user">普通员工</label>
      </div>
      <div>
        <input type="button" value="提交" @click="adduser" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userNo: '',
      name: '',
      passWord: '',
      isAdmin: false
    }
  },
  methods: {
    async adduser() {
      try {
        await this.$apollo.mutate({
          mutation: require('../../graphql/AddUser.gql'),
          variables: {
            input: {
              userNo: this.userNo,
              name: this.name,
              passWord: this.passWord,
              isAdmin: this.isAdmin
            }
          },
          update: (store, { data }) => {
            console.log(data)
          }
        })
      } catch (e) {
        alert(e)
      }
    }
  }
}
</script>

<style></style>
