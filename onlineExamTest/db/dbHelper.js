var entries = require('./jsonRes');
var User = require('./schema/user');
var Question = require('./schema/question');
var Answer = require('./schema/answer');

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
            data.status=1;
            // console.log(data);
        }
    })
};
exports.getStudentList=function(data,cb){
    User.find({type:0})
        .exec(function(err, docs) {
            var studentList=new Array();
            for(var i=0;i<docs.length;i++) {
                studentList.push(docs[i].toObject());
            }
            // console.log(studentList);
            cb(true, studentList);
        });
};

exports.addUser = function(data, cb){
    var user = new User({
        username: data.usr,
        password: data.pwd,
        type:data.type,
        number:data.number,
        grade:0,
        status:0
    });

    user.save(function(err) {
        if (err) {
            console.log('fail');
            cb(false, err);
        } else {
            console.log('success');
            if(user.type==0){
                console.log("学生");
                cb(true, entries);
            }
            // else if (doc != null) {
            //     entries.code = 99;
            //     entries.msg = '该用户名已存在！';
            //     cb(false, entries);
            // }
            else {
                console.log("teacher");
                cb(true, entries);
            }
        }
    })
};
exports.deleteStudent=function (data,cb) {
    User.findById(data, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                if (err) {
                    entries.msg = err;
                    cb(false,entries);
                }else{
                    entries.msg = '删除成功！';
                    cb(true,entries);
                }
            });
        } else {
            next(err);
        }
    });
};
exports.deleteQuestion=function (data,cb) {
    Question.findById(data, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                if (err) {
                    entries.msg = err;
                    cb(false,entries);
                }else{
                    entries.msg = '删除成功！';
                    cb(true,entries);
                }
            });
        } else {
            next(err);
        }
    });
};
exports.addQuestion = function(data, cb) {
    var question = new Question({
        number: data.number,//学号
        content: data.content,
        score: data.score,
        answer: data.answer
    });

    question.save(function(err, doc) {
        if (err) {
            entries.code = 99;
            entries.msg = '存储失败！';
            cb(false, entries);
            console.log('fail');
        } else {
            entries.code = 0;
            entries.msg = '成功！';
            console.log("success");
            cb(true, entries);
        }
    })
};
exports.getQuestionList=function(data,cb){
    Question.find()
        .exec(function(err, docs) {
            var questionList=new Array();
            for(var i=0;i<docs.length;i++) {
                questionList.push(docs[i].toObject());
            }
            cb(true, questionList);
            // console.log(questionList);
        });
};
// updateUser,分數更新
exports.updateUser = function (data, cb) {
    User.findOne({"_id": data.userId}, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';
        if(user.status !== 3) {
            User.update({"_id": data.userId}, {$set :{
                "grade": data.grade
            }
            },function(err, result){
                if(err) {
                    entries.code = 99;
                    console.log(err);
                }
                cb(true, entries);

            })
        }
    });
};
exports.updateStatus = function (data, cb) {
    User.findOne({"_id": data.userId}, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';
        if(user.status !== 3) {
            User.update({"_id": data.userId}, {$set :{
                "status": data.status
            }
            },function(err, result){
                if(err) {
                    entries.code = 99;
                    console.log(err);
                }
                cb(true, entries);

            })
        }
    });
};

exports.addAnswer = function (data, cb) {
    Answer.findOne({"userId": data.userId, "questionId": data.questionId}, function (err, doc) {
        if(doc === null) {
            var answer = new Answer({
                userId: data.userId,
                questionId: data.questionId,
                answerCtn: data.content
            });
            answer.save(function (err, doc) {
                if(err) {
                    entries.code = 99;
                    entries.msg-doc;
                }
                cb(true, entries);
            });
        }
        else {
            Answer.update({"userId": data.userId, "questionId": data.questionId}, {$set :{
                "answerCtn": data.content
            }
            }, function(error, result){
                if(error) {
                    entries.code = 99;
                    console.log("update error");
                }
                cb(true, entries);
            })
        }
    })
};
exports.getInfor = function (id, cb) {
    User.findById(id, function (err, doc) {
        if(err) {
            console.log(err);
        } else {
            var user = (doc !== null) ? doc.toObject() : "";
            cb(true, user);
        }
    })
};
//获得学生答题内容
exports.getAnswer = function (data, cb) {
    Answer.find({userId:data})
        .populate('questionId')
        .exec(function(err, docs) {
            if(docs!==null) {
                var AnswerList = new Array();
                for (var i = 0; i < docs.length; i++) {
                    AnswerList.push(docs[i].toObject());
                }
                cb(true, AnswerList);
            }
        });
};
//批量添加学生
// exports.batchAddStudent = function (data, cb) {
//   
// };