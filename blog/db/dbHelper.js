var entries = require('./jsonRes');
var mongoose = require('./db.js');
var User = require('./schema/user');
var News = require('./schema/news');
var webHelper = require('../lib/webHelper');
var md = webHelper.Remarkable();
var async = require('async');

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
};

//新闻
exports.addNews = function(data, cb) {
    //将markdown格式的新闻内容转换成html格式
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
            entries.data = doc.toObject();

            cb(true,entries);
        }
    })
};
// exports.findNews = function(data, cb) {
//     News.find()
//         .populate('author')
//         .exec(function(err, docs) {
//             var newsList=new Array();
//             for(var i=0;i<docs.length;i++) {
//                 newsList.push(docs[i].toObject());}
//             cb(true,newsList);
//         });
// };

exports.deleteNews = function(id, cb) {
    News.findById(id, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                if (err) {
                    entries.msg = err;
                    cb(false,entries);
                }else{
                    entries.msg = '删除新闻成功！';
                    cb(true,entries);
                }
            });
        } else {
            next(err);
        }
    });

};

var PAGE_SIZE = 5;
exports.findNews = function(req, cb) {
    // News.find()
    //   .populate('author')
    //     .exec(function(err, docs) {
    //
    //         var newsList=new Array();
    //         for(var i=0;i<docs.length;i++) {
    //             newsList.push(docs[i].toObject());
    //         }
    //         cb(true,newsList);
    //     });

    var page = req.query.page || 1 ;
    this.pageQuery(page, PAGE_SIZE, News, 'author', {}, {
        created_time: 'desc'
    }, function(error, data){
        if(error){
            next(error);
        }else{
            cb(true,data);
        }
    });
};



exports.findNewsOne = function(req, id, cb) {
    News.findOne({_id: id})
        .populate('author')
        .exec(function(err, docs) {
            // var docs = (docs !== null) ? docs.toObject() : '';
            // cb(true,docs);
            var docs = (docs !== null) ? docs : '';
            cb(true,docs);
        });
};


exports.pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page//当前页码
    };
    async.parallel({//并行:parallel 的原理是同时并行处理每一个流程,最后汇总结果,如果某一个流程出错就退出.
        count: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },

        records: function (done) {   // 查询一页的记录
            Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
                done(err, doc);//通过skip,limit进行分页。
                // 关于skip的效率问题，10W以下的记录，skip性能是可以接受的，10w以上的记录需要根据排序的字段，通过索引定位查询
            });
        }
    }, function (err, results) {
        var newsList=new Array();
        for(var i=0;i<results.records.length;i++) {
            newsList.push(results.records[i].toObject());
        }
        var count = results.count;
        $page.pageCount = parseInt((count - 1) / pageSize + 1);//算总页数
        $page.results = newsList;//当前页的记录
        $page.count = count;
        callback(err, $page);
    });
};