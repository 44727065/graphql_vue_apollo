<template>
  <div>
    <div>
      周报
      <ul>
        <router-link to="/weekly">周报</router-link>
        <router-link to="/weekly">周报</router-link>
      </ul>
      账户
      <ul>
        <li><router-link to="/user/profile">个人信息</router-link></li>
        <li><router-link to="/user/adduser">用户新增</router-link></li>
        <li><router-link to="/user/users">用户修改</router-link></li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>
