<template>
  <div>这里是个人信息 {{ userInfo }}</div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: ''
    }
  },
  methods: {
    async getuser() {
      try {
        await this.$apollo.mutate({
          mutation: require('../../graphql/SingleUser.gql'),
          update: (store, { data }) => {
            this.userInfo = JSON.stringify(data.singleUser)
          }
        })
      } catch (e) {
        alert(e)
      }
    }
  },
  mounted() {
    this.getuser()
  }
}
</script>

<style></style>
