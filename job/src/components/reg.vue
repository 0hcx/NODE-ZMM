<template>
<form  v-if="showReg" class="reg" method="post" @submit.prevent="reg()">
      <div class="blur"></div>
      <div class="g-reg">
        <a @click="showChange"><i class="fa fa-remove"></i></a>
        <div class="error" v-show="error">{{error}}</div>
        <input type="text" v-model="user.name" placeholder="用户名">
        <div>
          <input class="email" type="text" v-model="user.email" placeholder="邮箱">
          <a href="#" @click="send" >发送验证码</a>
        </div>
        <input v-if="sendEmail" type="text" v-model="user.code" placeholder="请输入验证码">
        <input type="password" v-model="user.password" placeholder="请输入密码">
        <input type="password" v-model="user.password_r" placeholder="再次输入密码">
        <input type="submit" value="提交" class="submit">
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
        user: {
          name: '',
          email:'',
          password: '',
          password_r: '',
          code: ''
        }
      }
    },
    computed: {
      ...mapActions({
        UserReg: 'UserReg',
        HideReg:'HideReg',
        SendEmail: 'SendEmail',
        SetTime: 'SetTime'
      }),
      ...mapGetters({
        ShowReg: 'ShowReg',
        SendEmail: 'SendEmail',
        GetCode: 'GetCode',
        GetTime: 'GetTime'
      }),
      showReg(){
        return this.ShowReg
      },
      sendEmail(){
        return this.SendEmail
      },
      getCode(){
        return this.GetCode
      },
      getTime(){
        return this.GetTime
      }
    },
    methods:{
      reg: function () {
       if (!this.user.name || !this.user.password || !this.user.password_r) {
          this.error = '输入不得为空'
        }else if(this.getCode != this.user.code){
            this.error = '验证码输入错误'
          } else if (this.user.password !== this.user.password_r) {
          this.error = '两次密码输入不一致'
        } else if (this.user.password.length < 3) {
          this.error = '密码长度不得小于3位'
        } else {
          this.$store.dispatch('UserReg', this.user);
        }
      },
      showChange (e) {
        this.$store.dispatch('HideReg');
      },
      send(e){
        if(!this.user.email){
          this.error = '邮箱不得为空'
        }else if(this.getCode){
          //当超过15min重新发送
          var date=new Date();
          if(((date-this.getTime)/(60.0*1000))>15){
            this.$store.dispatch('SetTime', date);
            this.$store.dispatch('SendEmail', this.user);
          }
          else{
            alert("验证码已发送，请稍后再试")
          }
        }else{
          var date=new Date();
          this.$store.dispatch('SetTime', date);
          this.$store.dispatch('SendEmail', this.user);
          alert("验证码已发送，15分钟内失效，请注意查收");
        }
      }
    }
  }

</script>
<style scoped>
.reg{
  width: 100%;
  transition: all ease .3s;
  display: flex;
  height: 90vh;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: -1;
}
.error{
  font-size: 15px;
}
.g-reg{
  width: 360px;
  height: 59vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  border: 1px solid #aaa;
  padding: 0px 30px 0px 30px;
  background-color: white;
}
.g-reg i{
  color: black;
  align-items: flex-end;
  padding-left: 350px;
  font-size: 15px;
}
.g-reg input{
  height: 25px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.g-reg .submit{
  background-color: rgba(236, 97, 73, 0.7);
  height: 38px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: white;
  font-size: 16px;
}
.g-reg .email{
  width: 70%
}
.g-reg a{
  font-size: 5px;
  color: #aaa;
  cursor: pointer;
}
.blur{
  width: 100%;
  height: 90vh;
  position: absolute;
  z-index: -1;
  background-color: rgba(1,1,1,0.1);
  /*background: url('../assets/img/login-bg.png') bottom center;*/
  -webkit-filter: blur(2px);
  -moz-filter: blur(2px);
  -ms-filter: blur(2px);
  -o-filter: blur(2px);
  filter: blur(2px);
}
</style>
