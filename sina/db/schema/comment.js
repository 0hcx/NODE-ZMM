var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 评论定义 */
var commentSchema = new Schema({
    //当前评论微博
    news: {type: ObjectId, ref: 'News'},
    content: String,       //评论内容
    name:String              //评论人
});

module.exports = mongoose.model('Comment', commentSchema);
