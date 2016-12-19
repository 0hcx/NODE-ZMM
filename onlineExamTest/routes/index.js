var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var fs = require('fs');
var entries = require('../db/jsonRes');
var xlsx = require('node-xlsx');
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
	var data2=({
	  	usr:'tom',
	  	pwd:'1',
	  	type:'1',
		status:'0'
	});
	// dbHelper.addUser(data1, function (success, doc) {
	//  console.log(doc);
	// });
	dbHelper.addUser(data2, function (success, doc) {
	  console.log(doc);
	});
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
router.get('/studentAdmin',function (req,res) {
	res.render('admin/studentAdmin', {
		user: req.session.user,
		layout: 'adminStudent',
		title: 'OnlineTest' });
});
//删除学生
router.get('/studentDelete/:id', function(req, res, next) {
	var id = req.params.id;
	console.log(id);
	dbHelper.deleteStudent(id, function (success, data) {
		req.session['message'] = data.msg;
		res.redirect("/studentAdmin");
	})
});
router.get('/questionDelete/:id', function(req, res, next) {
	var id = req.params.id;
	dbHelper.deleteQuestion(id, function (success, data) {
		req.session['message'] = data.msg;
		res.redirect("/questionAdmin");
	})
});
router.get('/questionAdmin',function (req,res) {
	res.render('admin/questionAdmin', {
		user: req.session.user,
		layout: 'adminQuestion',
		title: 'OnlineTest' });
});
router.get('/exam',function (req,res) {
	res.render('exam',{
		user: req.session.user,
		layout: 'main'
	});
});

router.get('/:id', function(req, res, next) {
	 var id = req.params.id;
	dbHelper.getInfor(id,function (success, doc1) {
		dbHelper.getAnswer(id,function (success, doc) {
			res.render('information', {
				user: req.session.user,
				student: doc1,
				data: doc,
				layout: 'main'
			});
			});
	});
});

router.post('/addQuestion', function(req, res, next) {
	dbHelper.addQuestion(req.body, function (success, doc) {
		// req.session['message'] = data.msg;
		res.send(doc);
	})
});
router.post('/addUser', function(req, res, next) {
	dbHelper.addUser(req.body, function (success, doc) {
		res.send(doc);
	})
});
router.post('/saveGrade', function(req, res, next) {
	dbHelper.updateUser(req.body, function (success, doc) {
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
//导入学生信息EXCEL文件
router.post('/importExcel', function(req, res, next){
	var workbook = xlsx.parse("./public/build/grade.xlsx");
	// var worksheet = workbook[0].data;
	console.log("导入中...");
	var obj = xlsx.parse(filename);
	console.log(JSON.stringify(obj));

	res.send('import successfully!');
});
//导出EXCEL文件
router.post('/exportExcel', function(req, res, next){
	var id = req.body.idList;
	var name = req.body.nameList;
	var grade=req.body.gradeList;
	var data = [];
	data[0] = ["学生学号", "学生姓名","学生成绩"];
	for(var i = 0; i < id.length; i++) {
		data[i + 1] = [id[i], name[i],grade[i]];
	}
	var buffer = xlsx.build([{name: "grade", data: data}]);
	fs.writeFileSync('./public/build/grade.xlsx', buffer, 'binary');
	res.send('export successfully!');
});
module.exports = router;


