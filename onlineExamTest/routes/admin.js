var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');


// router.get('/',function (req,res) {
//     res.render('teacher', {
//         user: req.session.user,
//         layout: 'admin',
//         title: 'OnlineTest' });
// });
// router.get('/:id', function(req, res, next) {
//     var id = req.params.id;
//     dbHelper.getInfor(id,function (success, doc1) {
//         dbHelper.getAnswer(id,function (success, doc) {
//             res.render('information', {
//                 user: req.session.user,
//                 student: doc1,
//                 data: doc,
//                 layout: 'main'
//             });
//         });
//     });
// });
module.exports = router;