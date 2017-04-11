var mongoose = require('../db');
var Schema = mongoose.Schema;


/* 用户定义 */
var userSchema = new Schema({
    uid:{type:String,unique:true},  //id唯一
    sex:String,                     //性别
    name: String  ,                 //昵称
    followCnt:  Number,             //所在地
    fansCnt:Number,                 //关注数
    weiboCnt:Number,                //微博数
    score:Number                    //评分
});


module.exports = mongoose.model('User', userSchema);
