var mongoose = require('../db');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    number: Number,//编号
    content: String,
    score:Number,//分值
    answer:String,//正确答案
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});
module.exports = mongoose.model('Question', questionSchema);
