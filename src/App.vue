<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">表单生成器</router-link> |
      <router-link to="/about">关于</router-link>
    </div>
     <router-view class="body-view" />
  </div>
</template>

<style lang="scss">
body{
  background-image: url('~@/assets/img/bg.jpg');
}
#nav {
  text-align: center;
  padding: 30px;

  a {
    font-weight: bold;
    color: #fff;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.body-view {
  opacity: 0.96;
  width: 80%;
  margin: 0 auto;
}
</style>
