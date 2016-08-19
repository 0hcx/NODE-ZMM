var express = require('express');
var router = express.Router();
// var User = require('../db/schema/user');
var dbHelper = require('../db/dbHelper');
var NodePDF = require('nodepdf');
var fs = require('fs');
var config = require('../config');
var formidable = require('formidable');
var entries = require('../db/jsonRes');
var Comment=require('../db/schema/comment');

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
	res.render('register', { layout: 'lg' });
});
router.post('/register', function(req, res, next) {
	dbHelper.addUser(req.body, function (success, doc) {
		res.send(doc);
	})
});

router.get('/search',function (req, res, next) {
	var keyword = req.query.keyword;
	var pattern = new RegExp(keyword, "i");
	dbHelper.findNewsContent(req, pattern, function (success, data) {
		res.render('blog', {
			layout: 'main',
			entries: data
		});
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
			layout: 'main',
			user: req.session.user

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
			layout: 'main',
			user: req.session.user

		});
	})
});
router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	dbHelper.findNewsOne(req, id, function (success, data) {
		dbHelper.findComment(id, function (success, comments) {
			// Comment.find({news:id}, function (success, comments) {
			res.render('blog',{
				layout: 'main',
				entries: data,
				comments: comments,
				user: req.session.user

			});
		});
	});
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

router.post('/addComment', function(req, res, next) {
	//发表评论
	console.log("发表评论");
	dbHelper.addComment(req.body, function (success, doc) {
		res.send(doc);
	})
});
module.exports = router;
