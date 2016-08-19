// var mongoose = require('../db');
// var Schema = mongoose.Schema;
// var ObjectId = Schema.Types.ObjectId;
//
// /* 评论定义 */
// var commentSchema = new Schema({
//     commentId: String,
//     news: {type: ObjectId, ref: 'News'},//当前评论页面
//     from: {type: ObjectId, ref: 'User'},//评论人
//     to: {type: ObjectId, ref: 'User'},
//     content: String,
//     reply: [{                           //回复数组
//         commentId: String,
//         from: {type: ObjectId, ref: 'User'},
//         to: {type: ObjectId, ref: 'User'},
//         content: String
//     }],
//     meta: {
//         updateAt: {type:Date, default: Date.now()},
//         createAt: {type:Date, default: Date.now()}
//     }
// });
//
// commentSchema.pre('save', function (next) {
//     if(this.isNew) {
//         this.meta.createAt = this.meta.updateAt = Date.now();
//     }else{
//         this.meta.updateAt = Date.now();
//     }
//     next();
// });
//
//
// module.exports = mongoose.model('Comment', commentSchema);
var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 评论定义 */
var commentSchema = new Schema({
    commentId: String,
    news: {type: ObjectId, ref: 'News'},
    from: {type: ObjectId, ref: 'User'},
    to: {type: ObjectId, ref: 'User'},
    content: String,
    reply: [{
        commentId: String,
        from: {type: ObjectId, ref: 'User'},
        to: {type: ObjectId, ref: 'User'},
        content: String
    }],
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

commentSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});


module.exports = mongoose.model('Comment', commentSchema);
