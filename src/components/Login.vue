<template>
  <div class="apollo-example">
    <!-- 登录部分 -->
    <div>
      <div><label>用户名</label><input v-model="userNo" /></div>
      <div><label>密码</label><input v-model="passWord" /></div>
      <div>
        <input type="submit" value="提交" @click="login" />
      </div>
    </div>

    <!-- Cute tiny form -->
    <div class="form">
      <label for="field-name" class="label">Name</label>
      <input v-model="name" placeholder="Type a name" class="input" id="field-name" />
    </div>

    <!-- Apollo watched Graphql query -->
    <!--
      :variables 引入的是 data 中的的变量,在 .gql 文件中用，用 $name 代表变量
      :update 对返回结果选择特定部分，
    -->
    <ApolloQuery :query="require('../graphql/HelloWorld.gql')" :variables="{ name }" :update="data => data.hello" :debounce="1000">
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occured</div>

        <!-- Result -->
        <!-- 返回值为简单类型，可以直接使用 -->
        <div v-else-if="data" class="result apollo">{{ data }}</div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

    <!-- Tchat example -->
    <ApolloQuery :query="require('../graphql/Messages.gql')">
      <ApolloSubscribeToMore :document="require('../graphql/MessageAdded.gql')" :update-query="onMessageAdded" />

      <div slot-scope="{ result: { data } }">
        <template v-if="data">
          <div v-for="message of data.messages" :key="message.id" class="message">
            {{ message.text }}
          </div>
        </template>
      </div>
    </ApolloQuery>
    <div>这里是添加部分</div>
    <ApolloMutation
      :mutation="require('../graphql/AddMessage.gql')"
      :variables="{
        input: {
          text: newMessage
        }
      }"
      class="form"
      @done="newMessage = ''"
    >
      <template slot-scope="{ mutate }">
        <form v-on:submit.prevent="formValid && mutate()">
          <label for="field-message">Message</label>
          <input id="field-message" v-model="newMessage" placeholder="Type a message" class="input" />
        </form>
      </template>
    </ApolloMutation>

    <div class="images">
      <div v-for="file of files" :key="file.id" class="image-item">
        <img :src="`${$filesRoot}/${file.path}`" class="image" />
      </div>
    </div>

    <div class="image-input">
      <label for="field-image">Image</label>
      <input id="field-image" type="file" accept="image/*" required @change="onUploadImage" />
    </div>
  </div>
</template>

<script>
import FILES from '../graphql/Files.gql'
import UPLOAD_FILE from '../graphql/UploadFile.gql' // mutation 引入

export default {
  data() {
    return {
      name: '变量名字',
      newMessage: '',
      userNo: '',
      passWord: ''
    }
  },
  // 配置进来
  apollo: {
    files: FILES
  },

  computed: {
    formValid() {
      return this.newMessage
    }
  },

  methods: {
    onMessageAdded(previousResult, { subscriptionData }) {
      return {
        messages: [...previousResult.messages, subscriptionData.data.messageAdded]
      }
    },

    async login() {
      try {
        await this.$apollo.mutate({
          mutation: require('../graphql/UserLogin.gql'),
          variables: {
            userNo: this.userNo,
            passWord: this.passWord
          },
          update: (store, { data: { userLogin } }) => {
            // 登录成功
            localStorage.setItem('apollo-token', userLogin.access_token)
            this.$router.push({
              path: '/user'
            })
          }
        })
      } catch (err) {
        console.log(typeof err)
        alert(err.message)
      }
    },

    async onUploadImage({ target }) {
      if (!target.validity.valid) return
      await this.$apollo.mutate({
        mutation: UPLOAD_FILE,
        variables: {
          file: target.files[0]
        },
        update: (store, { data: { singleUpload } }) => {
          const data = store.readQuery({ query: FILES })
          data.files.push(singleUpload)
          store.writeQuery({ query: FILES, data })
        }
      })
    }
  }
}
</script>

<style scoped></style>
