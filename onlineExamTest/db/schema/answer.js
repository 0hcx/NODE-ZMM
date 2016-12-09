var mongoose = require('../db');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var answerSchema = new Schema({
    userId: {type: ObjectId, ref: 'User'},
    questionId: {type: ObjectId, ref: 'Question'},
    answerCtn: String,//回答内容
    score: Number//得分
});
module.exports = mongoose.model('Answer', answerSchema);
