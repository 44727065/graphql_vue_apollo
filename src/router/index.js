import VueRouter from 'vue-router'
const routes = [
  { path: '/main', component: resolve => require(['../components/ApolloExample.vue'], resolve) },
  {
    path: '/user',
    component: resolve => require(['../components/Main.vue'], resolve),
    children: [
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'profile',
        component: resolve => require(['../components/user/Profile.vue'], resolve)
      },
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'adduser',
        component: resolve => require(['../components/user/AddUser.vue'], resolve)
      },
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'users',
        component: resolve => require(['../components/user/Users.vue'], resolve)
      }
    ]
  },
  {
    path: '/weekly',
    component: resolve => require(['../components/Main.vue'], resolve),
    children: [
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'addweekly',
        component: resolve => require(['../components/user/Profile.vue'], resolve)
      },
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'weeklys',
        component: resolve => require(['../components/user/AddUser.vue'], resolve)
      },
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'weeklys',
        component: resolve => require(['../components/user/AddUser.vue'], resolve)
      }
    ]
  },
  { path: '/', component: resolve => require(['../components/Login.vue'], resolve) }
]
export const router = new VueRouter({
  mode: 'history',
  routes // (缩写) 相当于 routes: routes
})
