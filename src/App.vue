<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">表单生成器</router-link> |
      <router-link to="/about">关于</router-link>
    </div>
    <transition name="component-fade" mode="out-in">
      <router-view class="body-view" />
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  watch: {},
};
</script>
<style lang="scss">
body {
  background-image: url("~@/assets/img/bg.jpg");
}
#nav {
  text-align: center;
  padding: 26px;

  a {
    font-size: 30px;
    font-weight: bold;
    color: #fff;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.body-view {
  background-color: #fff;
  opacity: 0.96;
  height: 80vh;
  width: 80%;
  margin: 0 auto;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
</style>
