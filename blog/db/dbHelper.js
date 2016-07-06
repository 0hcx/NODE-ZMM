var entries = require('./jsonRes');
var mongoose = require('./db.js');
var User = require('./schema/user');
var News = require('./schema/news');
var webHelper = require('../lib/webHelper');
var md = webHelper.Remarkable();

exports.findUsr = function(data, cb) {
    User.findOne({
        username: data.usr
    }, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';
        if (err) {
            console.log(err)
        } else if (doc === null) {
            entries.code = 99;
            entries.msg = '用户名错误！';
            cb(false, entries);
        } else if (user.password !== data.pwd) {
            entries.code = 99;
            entries.msg = '密码错误！';
            cb(false, entries);
        } else if (user.password === data.pwd) {
            entries.data = user;
            entries.code = 0;
            cb(true, entries);
        }
    })
};
exports.addUser = function(data, cb) {
    if (data.usr === "") {
        entries.code = 99;
        entries.msg = '请输入用户名 ！';
        cb(false, entries);
    }
    else if (data.password === "") {
        entries.code = 99;
        entries.msg = '请输入密码！';
        cb(false, entries);
    }
    else if (data.email === "") {
        entries.code = 99;
        entries.msg = '邮箱不能为空！';
        cb(false, entries);
    }
    else {
        User.findOne({username: data.usr}, function (err, usr) {
            if (err) {
                entries.code = 99;
                entries.msg = '注册失败 ！';
                cb(false, entries);
            } else if (usr) {
                entries.code = 99;
                entries.msg = '用户存在 ！';
                cb(false, entries);
            } else {
                var user = new User({
                    username: data.usr,
                    email: data.email,
                    password: data.pwd,
                    address:data.adr
                });
                user.save(function (err, usr) {
                    if (err) {
                        entries.code = 99;
                        entries.msg = '注册失败 ！';
                        cb(false, entries);
                    }
                    else {
                        entries.code = 0;
                        entries.msg = '注册成功 ！';
                        cb(true, entries);
                    }
                });
            }
        });
    }
}
//     var user = new User({
//         username: data.usr,
//         password: data.pwd,
//         email: data.email,
//         address: data.adr
//     });
//
//     user.save(function (err, data) {
//         if (err) {
//             cb(false, err);
//             entries.code = 99;
//             entries.msg = '注册失败！';
//         }
//         else if(data.username){
//             entries.code = 99;
//             entries.msg = '用户名已存在 ！';
//             cb(false, entries);
//         }
//         else if (data.username==="") {
//             entries.code = 99;
//             entries.msg = '用户名不能为空 ！';
//             cb(false, entries);
//         }
//         else if (data.username) {
//             entries.code = 99;
//             entries.msg = '用户名已存在 ！';
//             cb(false, entries);
//         }
//         else if (data.password==="") {
//             entries.code = 99;
//             entries.msg = '密码不能为空！';
//             cb(false, entries);
//         }
//         else {
//             entries.code = 0;
//             entries.msg = '注册成功！';
//             cb(true, entries);
//         }
//     });
// }
//新闻
exports.addNews = function(data, cb) {
    data.content = md.render(data.content);
    var news = new News({
        title: data.title,
        content: data.content,
        author:data.id
    });
    news.save(function(err,doc){
        if (err) {
            cb(false,err);
        }else{
            cb(true,entries);
        }
    })
};
exports.findNews = function(data, cb) {
    News.find()
        .populate('author')
        .exec(function(err, docs) {
            var newsList=new Array();
            for(var i=0;i<docs.length;i++) {
                newsList.push(docs[i].toObject());}
            cb(true,newsList);
        });
};

// exports.addUser = function(data, cb) {
//     var user = new User({
//         username: data.usr,
//         password: data.pwd,
//         email: data.email,
//         address: data.adr
//     });
//     function pan() {
//         User.count({username:data.usr},function(err,count){
//             if(count===0){
//                 return true;
//             }
//             else{
//                 return false
//             }
//         });
//     }
//     user.save(function (err, data) {
//         if (err) {
//             cb(false, err);
//             entries.code = 99;
//             entries.msg = '注册失败！';
//         }
//         else if (data.username==="") {
//             entries.code = 99;
//             entries.msg = '用户名不能为空 ！';
//             cb(false, entries);
//         }
//         else if (data.password==="") {
//             entries.code = 99;
//             entries.msg = '密码不能为空！';
//             cb(false, entries);
//         }
//         else  if(!pan()){
//             entries.code = 99;
//             entries.msg = '该用户已存在';
//             cb(false, entries);
//         }
//         // else if(User.findOne({
//         //         username: data.username
//         //     }, function(err, doc) {
//         //         var user = (doc !== null) ? doc.toObject() : '';
//         //         if (user.username === data.username) {
//         //             entries.code = 99;
//         //             entries.msg = '该用户已存在';
//         //             cb(false, entries);
//         //         }
//         //     }));
//         else {
//             entries.code = 0;
//             entries.msg = '注册成功！';
//             cb(true, entries);
//         }
//     });
// }

