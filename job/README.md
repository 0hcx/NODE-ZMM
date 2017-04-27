# vue-login

```
vue register login
基于vue2全家桶登录注册
```
## 环境依赖模块
```
vue-cli
vue2
vue-router
vuex
vue-axios
express
mongodb
jsonwebtoken
```
## 页面说明
```
/home                 // 首页，不需要登录可以访问
/person               // 个人页，需要登录后可以访问
/login                // 登录，不需要登录可以访问，登录后不可以访问
/reg                  // 注册，不需要登录可以访问，登录后不可以访问
/logout               // 退出登录，需要登录后才可以访问
```

### 运行程序
```
npm install
开启mongodb
mongod --dbpath
node app
npm run dev
http://localhost:8080/
```
