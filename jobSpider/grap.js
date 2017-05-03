var superagent = require('superagent')
var cheerio = require('cheerio')
var config = require('./config')
var jobList = require("./data/jobs")
var async = require('async')
var Jobs = require('./db/schema/job')

function getLink(cb) {
    var links = []
    for(var i = 0 ; i< jobList.length ; i++){
        var page=Math.ceil(jobList[i].number/60);
        for(var j = 1;j <= page;j++){
            var url = config.url.job_url + jobList[i].code +'&jl=%E6%9D%AD%E5%B7%9E&sm=0&p='+ j +"&kt=2&isfilter=1&fl=653&isadv=0";
            links.push(url)
        }
    }
    // console.log(links)
    cb(null,links)
}


//获取详细页面
var jobLink = []
function getDetailLink(links,cb) {
    async.eachLimit(links, 5, function(item, callback) {  
            superagent.get(item).end(function (err, res) {       
                try {
                    if(res.ok) {
                        console.log(item + ' 获取页面中...');
                        getJobLink(res.text);
                        callback();
                    } else {
                        console.log(item + ' 获取页面失败...');
                        callback();
                    }
                    sleep(0.1)
                } catch (e) {
                    console.log(e.message);
                    callback();
                }
            })
    }, function(err) {
        if (err) {
            console.log('Mession Failed!');
        } else {
            console.log('共获取到'+jobLink.length+'个具体页面');
            cb(null, jobLink);
        }
    });
}
function saveDB(jobLink,cb) {
    async.eachLimit(jobLink,30,function (item,cb) {
        superagent.get(item).end(function (err,res) {
            try {
                if(res.ok) {
                    console.log(item + ' 获取页面中...');
                    grapData(res.text,item);
                    cb();
                } else {
                    console.log(item + ' 获取页面失败...');
                    cb();
                }
            } catch (e) {
                console.log(e.message);
                cb();
            }
        })
    })
}
function grapData(text ,url ){
    var $ = cheerio.load(text);
    var job = {};
    var detail = $('.terminalpage-left ul  li').toArray()
    //职位类别
    job.posname =  ($(detail[7]).text()).split('：')[1];
    //职位月薪
    job.salary = ($(detail[0]).text()).split('：')[1];
    //发布日期
    job.pubdate = ($(detail[2]).text()).split('：')[1];
    //工作性质
    job.type = ($(detail[3]).text()).split('：')[1];
    //工作经验
    job.exp = ($(detail[4]).text()).split('：')[1];
    //最低学历
    job.edu = ($(detail[5]).text()).split('：')[1];
    //招聘人数
    job.count = ($(detail[6]).text()).split('：')[1];
    //公司
    job.company = $('.inner-left h2').text();
    //职位描述
    job.desc = $('.tab-inner-cont').text().replace(/\s+/g, '');
    job.url = url;
    saveJob(job)
    // console.log(job)
}
function saveJob(job){
    var job = new Jobs({
        posname:job.posname,
        salary:job.salary ,
        pubdate:job.pubdate,
        type:job.type ,
        exp:job.exp,
        edu:job.edu,
        count:job.count ,
        company:job.company ,
        desc:job.desc ,
        url:job.url
    });

    job.save(function (err, doc) {
        if (err) {
            console.log("失败");
        }
        else {
            console.log("保存成功");
        }
    });
}
function getJobLink(text) {
        var $ = cheerio.load(text);
        var jobs=$('.newlist_list_content table').toArray();
        for(var i=1;i<jobs.length;i++){
        var link=$(jobs[i]).find('div a').attr('href');
            jobLink.push(link)
        }
}
//等待函数
function sleep(seconds) {
    var startTime = new Date().getTime();       // get the current time
    while (new Date().getTime() < startTime + seconds*1000);    // hog cpu
};
function start() {
    async.waterfall([
        getLink,
        getDetailLink,
        saveDB
    ], function (err, result) {
        if(err) {
            console.log('error: ' + err);
        } else {
            console.log(jobLink.length)
            console.log('任务完成！！！');
        }
    });
}

start();












