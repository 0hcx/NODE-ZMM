<template>
    <form  v-if="showLogin" class="login" method="post" @submit.prevent="sub()">
      <div class="blur"></div>
      <div class="g-login">
        <a @click="showChange"><i class="fa fa-remove"></i></a>
        <div class="error" v-show="error">{{error}}</div>
        <input type="text" v-model="user.name" placeholder="UserName">
        <input type="password" v-model="user.password" placeholder="password">
        <input type="submit" value="登录" class="submit">
    </div>
  </form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mapGetters } from 'vuex'
  export default {
    data (){
      return {
        error:false,
        isLogin:false,
        user: {
          name: '',
          password: ''
        }
      }
    },
    computed: {
      ...mapActions({
        UserLogin: 'UserLogin',
        HideLog:"HideLog",
        ShowLogin:"ShowLogin"
      }),
      ...mapGetters({
        ShowLogin: 'ShowLogin'
      }),
      showLogin(){
        return this.ShowLogin;
      }
    },
    methods:{
      sub(){
        if (!this.user.name || !this.user.password ) {
          this.error = '输入不得为空'
        } else {
          this.$store.dispatch('UserLogin', this.user);
        }
      },
      showChange (e) {
        this.$store.dispatch('HideLog');
      }
    }
  }

</script>
<style scoped>
.login{
  width: 100%;
  transition: all ease .3s;
  display: flex;
  height: 92vh;
  justify-content: center;
  align-items: center;
  position: absolute;
}
.g-login{
  width: 360px;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: white;
  /*align-items: flex-end;*/
  border: 1px solid #aaa;
  padding: 0px 30px 0px 30px;

}
.g-login i{
  align-self: flex-end;
  padding-left: 350px;
}
.g-login .reg{
  align-self: center;
  font-size: 5px;
  color: #ccc;
  cursor: pointer;
}

.blur{
  width: 100%;
  height: 92vh;
  position: absolute;
  z-index: -1;
  background-color: rgba(1,1,1,0.1);
  -webkit-filter: blur(4px);
  -moz-filter: blur(4px);
  -ms-filter: blur(4px);
  -o-filter: blur(4px);
  filter: blur(4px);
}
.error{
  font-size: 15px;
}
input{
  /*width: 300px;*/
  height: 25px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 12px
}
.submit{
  background-color: rgba(236, 97, 73, 0.7);
  height: 38px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: white;
  font-size: 16px;
}
</style>
