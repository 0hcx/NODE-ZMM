import { USER_SIGNIN,USER_SIGNOUT,USER_REG,SHOW_LOGIN,NOLOG,SHOW_REG,NOREG,SAVECODE,SENDCODE,SAVETIME} from '../types'
var isLoggedIn = function() {
  var token = localStorage.getItem('user');
  if (token) {
    return JSON.parse(localStorage.getItem('user'))
  } else {
    return false;
  }
};

const state = {
  token: isLoggedIn() || null,
  showLogin:false,
  gotoLog:false,
  showReg:false,
  code: null,
  sendEmail:false,
  sendTime: null
};

const mutations = {
  [SHOW_REG](state){
    console.log("show");
    state.showReg = true;
    state.showLogin=false;
  },
  [SENDCODE](state){
    state.sendEmail = true;
  },
  [NOLOG](state){
    state.showLogin=false;
  },
  [NOREG](state){
    state.showReg = false;
  },
  [SHOW_LOGIN](state){
    state.showReg = false;
    state.showLogin = true;
  },
  [USER_SIGNIN](state, user) {
    localStorage.setItem('user',JSON.stringify(user));
    state.token = user
  },
  [SAVECODE](state,code){
    state.code = code;
    console.log(code);
  },
  [SAVETIME](state,time){
    state.sendTime = time;
  },
  [USER_SIGNOUT](state) {
    localStorage.removeItem('user');
    state.token = null;
  },
  [USER_REG](state, user) {
    localStorage.setItem('user',JSON.stringify(user));
    state.token = user
  }
}

export default {
  state,
  mutations
}
