/**
 * Created by 78643 on 2017/3/22.
 */
//遍历所有的微博及评论
var cheerio = require('cheerio');
var User = require('./db/schema/user');
var News = require('./db/schema/news');
var superagent=require('superagent');
var authorUrls=[];
var async=require('async');


//选取微博粉丝数目>500万，微博数大于100的大V
var conditions1 ={"fansCnt":{ "$gt":5000000},"weiboCnt":{ "$gt":0}};
User.find(conditions1, function(error,doc){
        if (error) {
            console.log(error);
        } else {
            for(var i=0;i<doc.length;i++){
                console.log(doc[i].name+" "+doc[i].fansCnt);
            }
            for(var i=860;i<doc.length;i++){
                authorUrls.push(doc[i].uid+" "+doc[i]._id);
            }
        }
    //异步回调
    async.mapLimit(authorUrls, 3 ,function (url, callback) {
        reptileMove(url, callback);
    }, function (err,result) {
       console.log("完成");
    });

});
var count=0;
function reptileMove(url,callback){
    //延迟毫秒数
    var delay = parseInt((Math.random() * 10000000000000) % 7000, 10);
    setTimeout(function() {
        var ids=url.split(" ");
        var urls="http://weibo.com/p/"+ids[0]+"?profile_ftype=1&is_hot=1#_0";
        superagent
            .get(urls)
            .set('Accept', 'application/json')
            .set('User-Agent', 'BaiduSpider')
            .end(function (err, res) {
                // sleep(1500);
                count=count+1;
                console.log(count+" "+urls);
                var body =  res.text;
                body.replace(/(\\n|\\t|\\r)/g, " ").replace(/\\/g, "");
                var $ = cheerio.load(body);
                var x=$('.WB_feed_detail .WB_detail ').toArray();
                var y=$('.WB_feed_handle ul').toArray();
                setTimeout(function () {
                for(var i = 0; i < x.length; i++) {
                    var info=($(y[i]).find('li')).toArray();
                    var news={};
                    news.content=($(x[i]).find('.WB_text').text()).replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
                    news.time=($(x[i]).find('.WB_from  a').attr('title'));
                    news.nid=($(x[i]).find('.WB_from  a').attr('href')).split("?")[0];
                    news.commentCnt=($(info[2]).find('span em')).text().substring(1);       //评论
                    news.praiseCnt=($(info[3]).find('span em')).text().substring(1);        //点赞
                    news.author=ids[1];
                    saveNews(news);
                }
                }, delay)

            });
        callback(null,url +'Call back content');
    }, delay);
}

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
};
function saveNews(news){
    var news = new News({
        nId:news.nid,
        content: news.content,
        time:news.time,
        commentCnt:news.commentCnt,
        praiseCnt:news.praiseCnt,
        author:news.author
    });
    
    news.save(function (err, doc) {
        if (err) {
            console.log("失败");
        }
        else {
            console.log(doc);
            console.log("保存成功");
        }
    });
}

