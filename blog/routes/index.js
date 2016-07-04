var express = require('express');
var router = express.Router();
var User = require('../db/schema/user');
var dbHelper = require('../db/dbHelper');
router.get('/homepage', function(req, res, next) {
  res.render('homepage', { newList: 'Express', layout: 'main' });
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
router.get('/news', function(req, res, next) {
	dbHelper.findNews(req.body, function (success, doc) {
		// res.send(doc);
		res.render('news', { entries: doc , layout: 'release'});
	})
});

module.exports = router;
