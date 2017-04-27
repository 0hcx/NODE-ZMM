<template>
  <div class="nav">
    <div class="menu">
      <a href="/">首页</a>
    </div>

    <div class="meg">
      <a v-if="!user"  class="login" href="#" @click="showLogin" >登录</a>
      <a v-if="!user"  class="reg" href="#" @click="showReg" >注册</a>
      <div v-if="user">欢迎进入：{{user.name}}</div>
      <a v-if="user" class="login" href="#" @click="logout" >登出</a>
    </div>
   </div>
</template>
<script>
  import { mapGetters ,mapActions } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        UserInfo:"UserInfo"
      }),
      ...mapActions({
        UserLogout:"UserLogout",
        ShowLogin:"ShowLogin",
        ShowReg:"ShowReg"
      }),
      user(){
        return this.UserInfo
      }
    },
    methods:{
      logout(){
        this.$store.dispatch('UserLogout');
      },
      showLogin(e) {
        this.$store.dispatch('ShowLogin')
      },
      showReg(e) {
        this.$store.dispatch('ShowReg')
      },
      redirect(){
        this.$router.push({ path: '/' })
      }
    }
  }
</script>
<style scoped lang='less'>

@font-white: #fff;

@main-pink: rgba(236,97,73,0.7);
@main-pinks: rgba(236,97,73,0.1);
@main-green-h: #ddd;
@main-gray:rgba(0,0,0,0.1);
@main-grays:rgba(100,100,100,0.6);
.nav {
    /*width: 100%;*/
    height: 45px;
    box-shadow: 2px 1px 1px @main-green-h;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    font-size: 15px;
    padding: 5px;
    
    .menu{
      flex-basis: 80%;
      display: flex;
      a{
        text-decoration: none;
        &:hover{
          text-decoration: none;
        }
      }
    }
    .meg{
      flex-basis: 20%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .reg {
        padding: 5px 15px 5px 15px;
        border: 1px solid @main-grays;
        background: #fff;
        border-radius: 3px;
        align-items: center;
        text-decoration: none;
        transition: all ease .3s;
        color: @main-grays;
        &:hover {
            background: @main-gray;
        }
    }
    .login {
        padding: 5px 15px 5px 15px;
        border: 1px solid @main-pink;
        background: #fff;
        border-radius: 3px;
        align-items: center;
        text-decoration: none;
        transition: all ease .3s;
        color: @main-pink;
        &:hover {
            background: @main-pinks;
        }
        .fa {
            font-size: 18px;
        }
    }

}
</style>
