import Vue from 'Vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios);

var instance = axios.create();

export default {
  localLogin: function (data) {
    return Vue.axios.post('/api/login',data)
  },
  localLogout: function () {
    return instance.post('/api/logout')
  },
  localReg: function (data) {
    return Vue.axios.post('/api/reg',data)
  },
  localEmail: function (data) {
    console.log(data);
    return Vue.axios.post('/api/sendEmail',data)
  }
}
