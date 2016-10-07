var entries = require('./jsonRes');
var config = require('../config');
var User = require('./schema/user');
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
    else if (data.pwd === "") {
        entries.code = 99;
        entries.msg = '请输入密码！';
        cb(false, entries);
    }
  
    else {
        User.findOne({username: data.usr}, function (err, usr) {
            if (err) {
                entries.code = 99;
                entries.msg = '注册失败 ！';
                cb(false, entries);
            }
            else {
                var user = new User({
                    username: data.username,
                    password: data.password,
                    telephone: data.telephone,
                    userThumb:data.userThumb
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
};

