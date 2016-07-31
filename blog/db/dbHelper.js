var entries = require('./jsonRes');
var mongoose = require('./db.js');
var User = require('./schema/user');
var News = require('./schema/news');
var Mooc = require('./schema/mooc');
var chapter = require('./schema/chapter');
var _ = require('underscore');//？

var webHelper = require('../lib/webHelper');
var md = webHelper.Remarkable();
var config = require('../config');
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
    else if (data.pwd === "") {
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
                    address:data.adr,
                    userThumb:data.userThumb
                    // imgUrl: data.imgUrl
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
exports.addMooc = function(data, cb) {

    var mooc = new Mooc({
        moocName: data.moocName,
        teacher: data.teacher,
        moocThumb:data.moocThumb
    });
    for (var i = 0; i < data.weekCount; i++) {
        for(var j = 0;j < data.classHour; j++) {
            mooc.children.push({
                content: ' ',
                title: 'XXXX',
                week: i,
                chapter: j
            });
        }
    }
    mooc.save(function(err,doc){
        cb(err, doc);
    })
};


exports.findMooc = function(req, cb) {
    var page = req.query.page || 1 ;
    this.pageQuery(page, PAGE_SIZE, Mooc, 'author', {}, {
        created_time: 'desc'
    }, function(error, data){
        if(error){
            next(error);
        }else{
            cb(true,data);
        }
    });
};

exports.findMoocOne = function(id, cb) {
    Mooc.findOne({_id: id}, function(err, docs) {
        var mooc = docs.toObject() || '';

        mooc.children = _.sortBy( mooc.children , "chapter");
        mooc.children = _.groupBy( mooc.children , "week" );
        cb(true,mooc);
    });
};


exports.findMoocChapContentOnly = function(moocId, chapId, preChapId, content, cb) {

    //取出章节内容显示
    Mooc.findOne({"_id": moocId, "children._id": chapId }, function(err, docs) {

        var doc = _.find(docs.children,function(item) {
            if (item._id.toString() === chapId)
                return this;
        })
        cb(err, doc);
    });

};

exports.findMoocChapContent = function(moocId, chapId, preChapId, content, cb) {
    async.waterfall([
        function (callback) {

            //取出章节内容显示
            Mooc.findOne({"_id": moocId, "children._id": chapId }, function(err, docs) {

                var doc = _.find(docs.children,function(item) {
                    if (item._id.toString() === chapId)
                        return this;
                })
                callback(err,doc);
            });
        },
        function (doc, callback) {

            //如果章节相同的话，不保存编辑内容
            if (chapId !== preChapId) {
                Mooc.update({"_id": moocId, "children._id": preChapId },{$set :{
                    'children.$.content': content
                }
                },function(err,data){
                    callback(err, doc);
                })
            }else{
                callback(true, doc);
            }
        }
    ], function (err, result) {
        cb(true, result);
    })
};

exports.updateMoocChapTitle = function( moocId, chapId, chapTitle, cb) {

    Mooc.update({"_id": moocId, "children._id": chapId },{$set :{
        'children.$.title': chapTitle
    }
    },function(err,result){
        cb(err, result);
    })
};

exports.queryMoocChapTitle = function( moocId, chapId, cb) {

    Mooc.findOne({"_id": moocId, "children._id": chapId },function(err,result){

        var doc = _.find(result.children,function(item) {
            if (item._id.toString() === chapId)
                return item;
        })

        cb(err, doc);
    })
};


exports.deleteMoocChap = function( moocId, chapId, cb) {


    Mooc.findOne({"_id": moocId, "children._id": chapId },function(err,doc){
        var week,chap,index,count = 0,pos = 0;


        for( var i =0;i<doc.children.length;i++) {
            var item = doc.children[i];
            if(item._id.toString() == chapId){
                week = item.week;
                chap = item.chapter;
                break;
            }
        }


        //计算当前chap的位置pos  以及该chap的总章节数量count
        for(var i =0;i<doc.children.length;i++) {
            var item = doc.children[i];
            if ( parseInt(item.week) == week ) {
                count++;
                if ( parseInt(item.chapter) > chap) {
                    pos++;
                }
            }
        }

        //如果该week只有1个chap，将后续week的week减一
        if (count == 1) {
            for(var i = 0 ;i<doc.children.length;i++) {
                var item = doc.children[i];
                if(parseInt(item.week) > week) {
                    doc.children[i].week--;
                }
            }
        }

        //如果该chap有后续chap，将后续chap减一
        if( pos >0 ) {
            for(var i = 0 ;i<doc.children.length;i++) {
                var item = doc.children[i];
                if (( parseInt(item.week) == week )&&( parseInt(item.chapter) > chap)) {
                    doc.children[i].chapter--;
                }
            }
        }

        //删除选中chap
        doc.children = _.filter(doc.children, function (item) {
            return item._id.toString() !== chapId;
        })

        // console.log("index:" + index + " subling:" +count + " sIndex:" + pos);

        doc.save(function(err) {
            cb(err, doc);
        });
    })
};



exports.addMoocChap = function( moocId, chapId, cb) {

    Mooc.findOne({"_id": moocId },function(err,doc){
        var week,chap,index,chapCount=0;

        //计算当前chap的位置index
        for( index =0;index<doc.children.length;index++) {
            var item = doc.children[index];
            if(item._id.toString() == chapId){
                week = item.week;
                chap = item.chapter;
                break;
            }
        }

        //计算当前chap的位置pos  以及该chap的总章节数量count
        for(var i =0;i<doc.children.length;i++) {
            var item = doc.children[i];
            if ( parseInt(item.week) == week ) {
                chapCount++;
            }
        }

        Mooc.update({"_id": moocId},{$push :{
            "children": {
                title: "XXXX",
                week: week,
                chapter: chapCount,
                content: " "
            },
            "$position": index
        }},function(err,result){
            cb(err, result);
        })

    })
};



exports.upMoocChap = function( moocId, chapId, cb) {

    Mooc.findOne({"_id": moocId, "children._id": chapId },function(err,doc){
        var week,chap,index,chapCount = 0,pos = 0;

        //计算当前chap的位置index
        for( index =0;index<doc.children.length;index++) {
            var item = doc.children[index];
            if(item._id.toString() == chapId){
                week = item.week;
                chap = item.chapter;
                break;
            }
        }

        //计算当前chap的位置pos  以及该chap的总章节数量count
        for(var i =0;i<doc.children.length;i++) {
            var item = doc.children[i];
            if ( parseInt(item.week) == week ) {
                chapCount++;
            }
        }

        var preWeek = _.filter(doc.children , function (item) {
            if ( parseInt(item.week) === week-1 )
                return item;
        });

        // console.log(preWeek.length);

        if (( parseInt(chap) === 0 )&&( parseInt(week) !== 0 )) {  //头节点

            if( chapCount > 1 ) { //有后续兄弟节点
                for(var i =0;i<doc.children.length;i++) {
                    var item = doc.children[i];
                    if (( parseInt(item.week) == week )&&( parseInt(item.chapter) > chap )) {
                        doc.children[i].chapter--;
                    }
                }
            }else{
                for(var i =0;i<doc.children.length;i++) {
                    var item = doc.children[i];
                    if ( parseInt(item.week) > week ) {
                        doc.children[i].week--;
                    }
                }
            }

            doc.children[index].week = week-1;
            doc.children[index].chapter = preWeek.length;
        }else{

            var preIndex;

            var curChap = (chap-1>0)?(chap-1):0;

            for(var i =0;i<doc.children.length;i++) {
                var item = doc.children[i];
                if (( parseInt(item.week) === week )&&( parseInt(item.chapter) === curChap )) {
                    preIndex = i;
                }
            }

            doc.children[preIndex].chapter++;
            doc.children[index].chapter--;
        }





        // console.log("index:" + index + " subling:" +count + " sIndex:" + pos);

        doc.save(function(err) {
            cb(err, doc);
        });
    })
};




exports.downMoocChap = function( moocId, chapId, cb) {

    Mooc.findOne({"_id": moocId, "children._id": chapId },function(err,doc){
        var week,chap,index,chapCount = 0,pos = 0, lastWeek=0;

        //计算当前chap的位置index
        for( index =0;index<doc.children.length;index++) {
            var item = doc.children[index];
            if(item._id.toString() == chapId){
                week = item.week;
                chap = item.chapter;
                break;
            }
        }

        //计算当前chap的位置pos  最后week的index
        for(var i =0;i<doc.children.length;i++) {
            var item = doc.children[i];
            if ( parseInt(item.week) == week ) {
                chapCount++;
            }
            if( parseInt(item.week) > lastWeek ) {
                lastWeek = parseInt(item.week);
            }
        }

        var nextWeek = _.filter(doc.children , function (item) {
            if ( parseInt(item.week) === week+1 )
                return item;
        });

        // console.log(preWeek.length);

        if (( parseInt(chap) === chapCount-1 )&&( parseInt(week) !== lastWeek )) {  //头节点

            if( chapCount > 1 ) { //有q前续兄弟节点
                for(var i =0;i<doc.children.length;i++) {
                    var item = doc.children[i];
                    if ( parseInt(item.week) == week+1 ) {
                        doc.children[i].chapter++;
                    }
                }
                doc.children[index].week = week+1;
                doc.children[index].chapter = 0;

            }else{
                for(var i =0;i<doc.children.length;i++) {
                    var item = doc.children[i];
                    if  ( parseInt(item.week) > week ) {
                        doc.children[i].week--;
                    }
                    if ( parseInt(item.week) == week+1 ) {
                        doc.children[i].chapter++;
                    }
                }
                doc.children[index].chapter = 0;
            }
        }else{

            var nextIndex;

            var curChap = (chap+1>chapCount)?chapCount:(chap+1);

            for(var i =0;i<doc.children.length;i++) {
                var item = doc.children[i];
                if (( parseInt(item.week) === week )&&( parseInt(item.chapter) === curChap )) {
                    nextIndex = i;
                }
            }

            doc.children[nextIndex].chapter--;
            doc.children[index].chapter++;
        }
        // console.log("index:" + index + " subling:" +count + " sIndex:" + pos);

        doc.save(function(err) {
            cb(err, doc);
        });
    })
};