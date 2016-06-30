var express = require('express');
var router = express.Router();
 var User = require('../db/schema/user');
 var dbHelper = require('../db/dbHelper');

// router.get('/blog', function(req, res, next) {
// 	res.render('blog', { newList: doc', layout: 'main' });
// 	});
router.get('/blog', function(req, res, next) {
  res.render('blog', { newList: 'Express', layout: 'main' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { layout: 'lg' });
});

router.post('/login', function(req, res, next) {
  dbHelper.findUsr(req.body, function (success, doc) {
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
router.get('/blog/:id', function(req, res, next) {

	var id = req.params.id;
	dbHelper.findNewsOne(req, id, function (success, data) {
		res.render('blog', {
			entries: data
		});
	})
});


router.get('/blogs', function(req, res, next) {
	dbHelper.findNews(req, function (success, data) {
		res.render('blogs', {
			entries: data.results,
			pageCount: data.pageCount,
			pageNumber: data.pageNumber,
			count: data.count
		});
	})
});
module.exports = router;
