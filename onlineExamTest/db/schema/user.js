var mongoose = require('../db');
var Schema = mongoose.Schema;

/* 用户定义 */
var userSchema = new Schema({
    username: String,
    password: String,
    number:Number,//学号
    type:Number,//类型 0 学生 1 老师
    status: Number,//状态 0 未上线 1 上线 2 考试中 3 考务完毕
    grade:Number,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});
module.exports = mongoose.model('User', userSchema);
