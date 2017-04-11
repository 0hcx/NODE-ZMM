var mongoose = require('../db');
var Schema = mongoose.Schema;

/*微博定义 */
var newsSchema = new Schema({
    nId:{type:String,unique:true},
    content: String,    //内容
    time:String,
    commentCnt:String,
    praiseCnt:String,
    author: {           //作者
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
});

module.exports = mongoose.model('News', newsSchema);
