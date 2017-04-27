<template>
  <div id="home">
    <login/>
    <reg/>
    <div class="main">homepage</div>
  </div>
</template>

<script>
import reg from './reg.vue'
import login from './login.vue'
export default {
  components: {
    reg,
    login
  }
}
</script>
<style scoped>
.main{
  z-index: -99;
  position: absolute;
  width: 100%;
  height: 93vh;
  padding: 5px;
  font-size: 15px;
  background: url('../assets/img/login-bg.png') bottom center;
}
</style>
