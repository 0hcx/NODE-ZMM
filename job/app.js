require('dotenv').load();
var express = require('express');
var path = require('path');
var fs = require('fs');
var morgan     = require("morgan");
var bodyParser = require('body-parser');
var mongoose   = require("mongoose");
var User = require('./models');
var app = express();
var nodemailer = require('nodemailer');

mongoose.connect('mongodb://localhost/vuelogin');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","POST,GET");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.post('/api/login', function(req, res) {
  User.findOne({name: req.body.name, password: req.body.password}, function(err, user) {
    if (err) {
      res.send({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
        res.send({
          type: true,
          data: user
        });
      } else {
        console.log("用户未注册");
        res.send({
          type: false,
          data: "用户未注册"
        });
      }
    }
  });
});

app.post('/api/logout', function(req, res) {
  res.send({
    type: "1"
  })
});
function getRanom(){
  return num = parseInt(Math.random()*9000 + 1000);
}
app.post('/api/sendEmail', function(req, res) {
  var email = req.body.email;
  console.log(email);
  var success = false;
  var number = getRanom();
  var transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '786437091@qq.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'odbmwzsvarwabebi'
    }
});
var mailOptions = {
    from: '786437091@qq.com', // 发件地址
    to: email, // 收件列表
    subject: '邮箱信息验证', // 标题
    //text和html两者只支持一种
    text: '验证码是'+number // 标题
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log("出错");
    }
    else{
      success = true;
      console.log("成功")
    }
    res.send({
      type: success,
      data: number
    });
  });
});

app.post('/api/reg', function(req, res) {
  User.findOne({name: req.body.name, email:req.body.email,password: req.body.password}, function(err, user) {
    if (err) {
      res.send({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
        console.log("用户已注册");
        res.send({
          type: false,
          data: "用户已注册"
        });
      } else {
        var userModel = new User();
        userModel.name = req.body.name;
        userModel.email = req.body.email;
        userModel.password = req.body.password;
        userModel.save(function(err, user) {
          user.save(function(err, user1) {
            res.send({
              type: true,
              data: user
            });
          });
        })
      }
    }
  });
});

app.use(function(err, req, res, next) {
  if (err.name == 'UnauthorizedError') {
    res.status(401);
    res.send({ message: err.name + ":" + err.message });
  }
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
