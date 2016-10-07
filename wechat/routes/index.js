var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var User = require('../db/schema/user');
var formidable = require('formidable');
var entries = require('../db/jsonRes');

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login '});
});

router.post('/login', function(req, res, next) {
  var user = new User({
    username: 'mia',
    password: '1'
  });
  user.save(function (err) {
    if(err){
      console.log('保存失败');
    }
    console.log('success');
  });
  dbHelper.findUsr(req.body, function (success, doc) {
    req.user = doc.data;
    res.send(doc);
  })
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'register' });

});
router.post('/register', function(req, res) {
  dbHelper.addUser(req.body, function (success, doc) {
    res.send(doc);
  });
});
//上传图片
router.post('/uploadImg', function(req, res, next) {
  var form = new formidable.IncomingForm();
  var path = "";
  var field = [];
  form.encoding = 'utf-8';
  form.uploadDir = "./public/upload";
  form.keepExtensions = true;
  form.maxFieldsSize = 30000 * 1024 * 1024;
  form.parse(req);
  form.on('field', function(field, value) {
    console.log(field + ":" + value);
  })
      .on('file', function(field, file) {
        path = '\\' + file.path;
      })
      .on('end', function() {
        console.log('-> upload done\n');
        entries.code = 0;
        entries.data = path;
        res.writeHead(200, {
          'content-type': 'text/json'
        });
        res.end(JSON.stringify(entries));
      })
      .on("err",function(err){
        var callback="<script>alert('"+err+"');</script>";
        res.end(callback);//这段文本发回前端就会被同名的函数执行
      }).on("abort",function(){
    var callback="<script>alert('"+ttt+"');</script>";
    res.end(callback);
  });
});
router.get('/', function(req, res, next) {
  res.render('chat', { title: 'Wechat '});
});
module.exports = router;
