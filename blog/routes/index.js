var express = require('express');
var router = express.Router();
var User = require('../db/schema/user');
var dbHelper = require('../db/dbHelper');
var NodePDF = require('nodepdf');
var fs = require('fs');
var config = require('../config');
var formidable = require('formidable');
var entries = require('../db/jsonRes');

router.get('/login', function(req, res, next) {
  res.render('login', { layout: 'lg' });
});
router.post('/login', function(req, res, next) {
  dbHelper.findUsr(req.body, function (success, doc) {
	  req.session.user = doc.data;
    res.send(doc);
  })
});
router.get('/', function(req, res, next) {
	res.render('login', { layout: 'lg' });
});
router.post('/', function(req, res, next) {
	dbHelper.findUsr(req.body, function (success, doc) {
		req.session.user = doc.data;
		res.send(doc);
	})
});


router.get('/register', function(req, res, next) {
	res.render('register', { layout: 'register' });
});
router.post('/register', function(req, res, next) {
	dbHelper.addUser(req.body, function (success, doc) {
		res.send(doc);
	})
});

router.get('/', function(req, res, next) {
	var user = new User({
		username: 'tom',
		password: '1'
	});
	user.save(function (err) {
		if(err){
			console.log('保存失败');
		}
		console.log('success');
	})
});
//上传图片
router.post('/uploadImg', function(req, res, next) {
	var io = global.io;
	var form = new formidable.IncomingForm();
	var path = "";
	var fields = [];
	form.encoding = 'utf-8';
	form.uploadDir = "./public/upload";
	form.keepExtensions = true;
	form.maxFieldsSize = 30000 * 1024 * 1024;
	var uploadprogress = 0;
	console.log("start:upload----"+uploadprogress);
	form.parse(req);
	form.on('field', function(field, value) {
		console.log(field + ":" + value);
	})
		.on('file', function(field, file) {
			path = '\\' + file.path;
		})
		.on('progress', function(bytesReceived, bytesExpected) {

			uploadprogress = (bytesReceived / bytesExpected * 100).toFixed(0);
			console.log("upload----"+ uploadprogress);
			io.sockets.in('sessionId').emit('uploadProgress', uploadprogress);
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
router.get('/blogs', function(req, res, next) {
	dbHelper.findNews(req, function (success, data) {
		res.render('blogs', {
			entries: data.results,
			pageCount: data.pageCount,//算总页数
			pageNumber: data.pageNumber,
			count: data.count,// 查询数量
			layout: 'main'
		});
	})
});


router.get('/moocs', function(req, res, next) {
	dbHelper.findMooc(req, function (success, data) {
		res.render('./moocs', {
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count,
			layout: 'main'
		});
	})
});


router.get('/mooc/:id', function(req, res, next) {
	var id = req.params.id;
	dbHelper.findMoocOne( id,  function (success, doc) {
		res.render('./mooc', { entries: doc, layout: 'main' });
	})
});


router.post('/moocGetChapContentOnly', function(req, res, next) {
	var moocId    = req.body.moocId;
	var chapId    = req.body.chapId;
	var preChapId = req.body.preChapId;
	var content   = req.body.content;
	dbHelper.findMoocChapContentOnly( moocId, chapId, preChapId, content, function (success, doc) {
		res.send(doc);
	})
});



module.exports = router;
