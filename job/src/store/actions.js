import api from '../api'
import { USER_SIGNIN,USER_SIGNOUT,USER_REG,SHOW_LOGIN,NOLOG,SHOW_REG,NOREG,SAVECODE,SENDCODE,SAVETIME} from './types'

export const UserLogin = ({ commit }, data) => {
  api.localLogin(data).then(function (response) {
    if( response.data.type == true) {
      commit(USER_SIGNIN, response.data.data);
      window.location = '/person'
    }else{
      window.location = '/'
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};

export const ShowLogin = ({ commit }) => {
  commit(SHOW_LOGIN);
};
export const ShowReg = ({ commit }) => {
  commit(SHOW_REG);
};
export const UserLogout = ({ commit }) => {
  api.localLogout().then(function (response) {
    commit(USER_SIGNOUT);
    window.location = '/'
  })
    .catch(function (error) {
      console.log(error);
    });
};

export const UserReg = ({ commit }, data) => {
  api.localReg(data).then(function (response) {
    if( response.data.type == true) {
      commit(USER_REG, response.data.data);
      window.location = '/person'
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};

export const SendEmail = ({ commit } ,data) => {
  api.localEmail(data).then(function (response) {
    console.log(response.data.type);
    if( response.data.type == true) {
      commit(SENDCODE);
      commit(SAVECODE, response.data.data);
    }
    else{
      alert("请输入有效的邮箱");
      commit(SAVECODE, null);
      commit(SAVETIME, null);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};

export const SetTime = ({ commit },data) => {
  commit(SAVECODE,data);
}
export const HideLog = ({ commit }) => {
  commit(NOLOG);
};
export const HideReg = ({ commit }) => {
  commit(NOREG);
};
