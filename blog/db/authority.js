/*权限验证中间件*/
'use strict';
//登录权限控制
module.exports = {
    isAuthenticated: function (req, res, next) {
        if(typeof(req.session.user) !=='undefined') {
            return next();
        }else{
            res.redirect('/');
        }
    }
};