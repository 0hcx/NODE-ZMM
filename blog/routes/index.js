var express = require('express');
var router = express.Router();
var userSchema = require('../db/schema/user');
var dbHelper = require('../db/dbHelper');


router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express', layout: 'main' });
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
	var mongoose = require('mongoose');

	mongoose.connect('mongodb://127.0.0.1:27017/test');

	var Schema = mongoose.Schema;

	var blogSchema = new Schema({
		title:  String,
		author: String,
		body:   String
	});

	var Blog = mongoose.model('Blog', blogSchema);

	var User = mongoose.model('User', userSchema);

	var user = new User({
		username: 'Mia',
		password: '1'
	})
	user.save(function (err) {
		if(err){
			console.log('保存失败');
		}
		console.log('success');
	})
})

module.exports = router;
