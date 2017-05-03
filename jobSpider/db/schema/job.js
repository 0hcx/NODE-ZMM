/**
 * Created by 78643 on 2017/5/3.
 */
var mongoose = require('../db');
var Schema = mongoose.Schema;

var jobSchema = new Schema({
    posname: String,
    salary: String,
    pubdate: String,
    type: String,
    exp: String,
    edu: String,
    count: String,
    company: String,
    desc: String,
    url: {type:String,unique:true}
});


module.exports = mongoose.model('Jobs', jobSchema);
