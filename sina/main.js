var iconv = require('iconv-lite'); //字符集转换
var Request = require('request');
var RsaEncrypt = require("./rsa").RSAKey;
var async = require('async');
var cheerio = require('cheerio');
var cookieColl = Request.jar();
var request = Request.defaults({jar: cookieColl});
var User=require('./db/schema/user');

function getJsonObj(body){
    var start = body.indexOf("{");
    var end = body.lastIndexOf("}");
    var jsonStr = body.substr(start,end -start + 1);
    var responseJson = JSON.parse(jsonStr);
    return responseJson;
}
function start() {
    var userName = "13868858391";
    var password = "455498";

    var preLoginUrl = "http://login.sina.com.cn/sso/prelogin.php?entry=weibo&callback=sinaSSOController.preloginCallBack&su=&rsakt=mod&checkpin=1&client=ssologin.js(v1.4.11)&_=" + (new Date()).getTime();

    async.waterfall([
        function (callback) {
            request({
                "uri": preLoginUrl,
                "encoding": "utf-8"
            }, callback);
        },
        function (res, body, callback) {
            var responseJson = getJsonObj(body);
            var loginUrl = 'http://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.18)';
            var loginPostData = {
                entry: "weibo",
                gateway: "1",
                from: "",
                savestate: "7",
                useticket: "1",
                vsnf: "1",
                su: "",
                service: "miniblog",
                servertime: "",
                nonce: "",
                pwencode: "rsa2",
                rsakv: "1330428213",
                sp: "",
                sr: "1366*768",
                encoding: "UTF-8",
                prelt: "282",
                url: "http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack",
                returntype: "META"
            };

            loginPostData.su = new Buffer(userName).toString('base64');

            var rsaKey = new RsaEncrypt();
            rsaKey.setPublic(responseJson.pubkey, '10001');
            var pwd = rsaKey.encrypt([responseJson.servertime, responseJson.nonce].join("\t") + "\n" + password);


            loginPostData.sp = pwd;
            loginPostData.servertime = responseJson.servertime;
            loginPostData.nonce = responseJson.nonce;
            loginPostData.rsakv = responseJson.rsakv;

            request.post({
                "uri": loginUrl,
                "encoding": null,  //GBK编码 需要额外收到处理,
                form: loginPostData
            }, callback);
        },
        function (res, body, callback) {
            body = iconv.decode(body,"GBK");
            var errReason = /reason=(.*?)\"/;
            var errorLogin = body.match(errReason);

            if (errorLogin) {
                callback("登录失败,原因:" + errorLogin[1]);
            }
            else {
                var urlReg = /location\.replace\(\'(.*?)\'\)./;
                var urlLoginAgain = body.match(urlReg);

                if (urlLoginAgain) {

                    request({
                        "uri": urlLoginAgain[1],
                        "encoding": "utf-8"
                    }, callback);
                }
                else {
                    callback("match failed");
                }
            }
        },
        function (res, body, callback) {
            console.log("开始分析... ");
             getfollow("1005056168497266");
        }
    ], function (err) {
        console.log(err)
    });
}
function saveUser(user){
    var user = new User({
        uid:user.uid,
        sex:user.sex,
        name:user.name,
        followCnt:user.followCnt,
        fansCnt:user.fansCnt,
        weiboCnt:user.weiboCnt
    });
    user.save(function (err, usr) {
        if (err) {
            console.log("失败");
        }
        else {
            console.log(user);
            if(user.fansCnt>10000) {
                sleep(1000);
                getfollow(user.uid);
                console.log("保存成功");
            }
        }
    });
}

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
};

function getfollow(userId) {
    //取首页关注者信息
        setTimeout(function () {
            sleep(100);
            var baseurl = "http://weibo.com/p/" + userId + "/follow";
            console.log(baseurl);
            request({
                "uri": baseurl,
                "encoding": "utf-8",
                header: {
                    "User-Agent": "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                }
            }, function (err, res, body) {
                if(!err) {
                    var matched = body.match(/\"follow_list\s*\\\".*\/ul>/gm);
                    if (matched) {
                        var str = matched[0].replace(/(\\n|\\t|\\r)/g, " ").replace(/\\/g, "");
                        var ulStr = "<ul class=" + str;
                        var $ = cheerio.load(ulStr);
                        var follows = $('.follow_item ').toArray();
                        for (var i = 0; i < follows.length; i++) {
                            var data = $(follows[i]).attr("action-data").split("&");
                            var detail = $(follows[i]).find(".info_connect span .count");
                            var identify=$(follows[i]).find(".info_name a");

                            //获得名字，id，性别
                            //获得关注数，粉丝数，微博数
                            //存储会员或者加V的人
                            //排除特殊微博用户

                            if (data.length === 3 && detail.length === 3 && identify.length>=3 ) {
                                var flag=$(follows[i]).find('.info_name a').attr('href').split(/[_=]/)[2].substr(0,6);
                                var user={};
                                user.uid = flag+data[0].split("=")[1];
                                user.name = data[1].split("=")[1];
                                user.sex = data[2].split("=")[1];
                                user.followCnt = parseInt($(detail[0]).text());
                                user.fansCnt = parseInt($(detail[1]).text());
                                user.weiboCnt = parseInt($(detail[2]).text());
                                // user.flag = flag;

                                var url = "http://weibo.com/p/" + +user.uid + "/follow";
                                console.log(url);
                                // follows.push(user.uid);
                                saveUser(user);
                                //
                            }
                        }
                    }
                }
            })
        }, 1000)
}
// async.mapLimit(follows, 5, function(item, callback) {
//     getfollow(item,callback);
// }, function (err, result) {
//     console.log(result);
// });

start();
