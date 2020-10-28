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
/*定义滚动条宽度*/
@charset "utf-8";
::-webkit-scrollbar 
{ 
  width: 5px; 
}
  
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track 
{ 
  border-radius: 10px; 
  background-color: rgba(0,0,0,0.1); 
} 
  
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb 
{ 
  border-radius: 10px; 
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); 
  background-color: rgba(0,0,0,0.1);
} 
</style>
