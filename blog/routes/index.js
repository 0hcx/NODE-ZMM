var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var fs = require('fs');
var entries = require('../db/jsonRes');
// var Comment=require('../db/schema/comment');


router.get('/Setting', function(req, res, next) {
	// dbHelper.findNews(req, function (success, data) {
		res.render('Setting', {
			layout: 'main',
			user: req.session.user

		});
	// })
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
