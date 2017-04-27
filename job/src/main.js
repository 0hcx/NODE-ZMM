import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import App from './App'
import error from './components/error'
import Login from './components/login'
import Reg from './components/reg'
import Person from './components/person'
import home from './components/home'
import store from './store/index'

Vue.config.productionTip = false

const routes = [{
  path : '/',
  component : home,
  meta: { auth: false }
},{
  path : '/login',
  component : Login,
  meta: { auth: false },
},{
  path : '/reg',
  component : Reg,
  meta: { auth: false },
},{
  path : '/person',
  component : Person
},{
  path : '*',
  component : error
}];

const router = new VueRouter({
  mode: 'history',
  saveScrollPosition: true,
  routes
});

router.beforeEach(({meta, path}, from, next) => {
  var { auth = true } = meta;
  var isLogin = Boolean(store.state.login.token) //true用户已登录， false用户未登录

  if (auth && !isLogin && path !== '/login') {
    return next({ path: '/login' })
  }

  next()
});

var app = new Vue({
  el: '#app',
  router,
  store,
  ...App,
});
