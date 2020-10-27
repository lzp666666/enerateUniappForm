<template>
  <div id="app">
    <div id="nav">
      <router-link to="/build">表单生成器</router-link> |
      <router-link to="/about">关于</router-link>
    </div>
     <router-view class="body-view" />
  </div>
</template>

<style lang="scss">
#nav {
  text-align: center;
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.body-view {
  width: 80%;
  margin: 0 auto;
}
</style>
