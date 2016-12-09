var express = require('express');
var router = express.Router();
var User = require('../db/schema/user');
var dbHelper = require('../db/dbHelper');
/* GET home page. */
router.get('/', function(req, res, next) {
	//添加问题
	// var data=({
	//   content:'黑五是几月几号',
	//   number:4
	// });
	// dbHelper.addQuestion(data, function (success, doc) {
	//  console.log(doc);
	// });
	//添加user
	// var data1=({
	//   usr:'hey',
	//   pwd:'1',
	//   type:'0',
	//   number:'2014166371',
	//   status:'0'
	// });
	// var data2=({
	//   	usr:'tom',
	//   	pwd:'1',
	//   	type:'1',
	// 	status:'0'
	// });
	// dbHelper.addUser(data1, function (success, doc) {
	//  console.log(doc);
	// });
	// dbHelper.addUser(data2, function (success, doc) {
	//   console.log(doc);
	// });
	// res.render('login', { layout: 'lg' });
	res.render('login', { layout: 'index',title: 'OnlineTest' });
});
router.post('/', function(req, res) {
	dbHelper.findUsr(req.body, function (success, doc) {
		//在这里得到用户的信息
		req.session.user = doc.data;
		res.send(doc);
	})
});
router.post('/getStudentList', function(req, res, next) {
	dbHelper.getStudentList(req.body, function (success, data) {
		res.send(data);
	})
});
router.post('/getQuestionList', function(req, res, next) {
	dbHelper.getQuestionList(req.body, function (success, data) {
		res.send(data);
	})
});
router.get('/admin',function (req,res) {
	res.render('teacher', {
		user: req.session.user,
		layout: 'admin',
		title: 'OnlineTest' });
});
router.get('/exam',function (req,res) {
	res.render('exam',{
		user: req.session.user,
		layout: 'main'
	});
});

router.get('/admin/detail/:id', function(req, res, next) {
	 var id = req.params.id;

		dbHelper.getAnswer(id,function (success, doc) {
			dbHelper.getInfor(id,function (success, doc1) {
			res.render('information', {
				data: doc1,
				student: doc,
				layout: 'index'
			});});
	});
});
router.post('/addQuestion', function(req, res, next) {
	dbHelper.addQuestion(req.body, function (success, doc) {
		res.send(doc);
	})
});
router.post('/addUser', function(req, res, next) {
	dbHelper.addUser(req.body, function (success, doc) {
		res.send(doc);
	})
});
router.post('/saveAnswer',function (req,res,next) {
	dbHelper.addAnswer(req.body, function (success, doc) {
		res.send(doc);
	})
});
router.post('/updateStatus',function (req,res,next) {
	dbHelper.updateStatus(req.body, function (success, doc){
		res.send(doc);
	})
});

		// 	dbHelper.getAnswer(id,function (success, doc) {
	// 		res.render('information', {
	// 			// student: doc,
	// 			layout: 'index'
	// 		});
	// });
	// res.render('information', { layout: 'index',title: 'OnlineTest' });


// router.post('/admin/detail/:id', function(req, res, next) {
// 	var id = req.params.id;
// 	dbHelper.getInfor(id, function (success, doc) {
// 		res.render('information', {
// 			student: doc
// 		});
// 	});
// })
router.get('/getAnswer', function(req, res, next) {
	dbHelper.getAnswer(data,function (success, doc) {
		res.send(doc);
	});
});

module.exports = router;


