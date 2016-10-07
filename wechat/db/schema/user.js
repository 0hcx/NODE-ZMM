/**
 * Created by Zoe on 2016/10/5.
 */
var mongoose = require('../db');
var  Schema=mongoose.Schema;
// var bcrypt=require('bcrypt');
// var SALT_WORK_FACTOR=10;
/* 用户定义 */
var userSchema = new Schema({
    username: String,
    password: String,
    telephone:String,
    userThumb:String,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

userSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next();
});


module.exports = mongoose.model('User', userSchema);
// var userSchema = new Schema({
//     nickname : {
//         unique:true,
//         type: String
//     },
//     password : String,
//     telephone : String,
//     meta : {
//         updateAt:{
//             type:Date , default:Date.now()
//         },
//         createAt:{
//             type:Date , default:Date.now()
//         }
//     }
// });
// userSchema.pre('save',function (next) {
//     // var  user=this;
//     if(this.isNew){
//         this.meta.createAt=this.meta.updateAt=Date.now();
//     }
//     else {
//         this.meta.updateAt=Date.now();
//     }
//     // bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt) {
//     //     if(err) return next(err);
//     //     bcrypt.hash(salt,user.password,function (err,hash) {
//     //         if(err) return next(err);
//     //         user.password=hash;
//     //     })
//     // });
//     next();
// });
//
// module.exports=mongoose.model('User',userSchema);