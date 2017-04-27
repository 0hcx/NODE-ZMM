<template>
  <div id="app">
    <navbar/>
    <router-view></router-view>
  </div>
</template>
<style scoped>
</style>
<script>
import navbar from './components/navbar.vue'
export default {
  components: {
    navbar
  }
}
</script>
<style scoped>
#app{
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
