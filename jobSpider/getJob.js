var superagent = require('superagent')
var cheerio = require('cheerio')
var config = require('./config')
var url="http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%E6%9D%AD%E5%B7%9E&kt=2&isadv=0&ispts=1&isfilter=1&p=1&bj=160000&sj=045"

function start() {
    var job=[];
    var opt = {
        Referer: url,
        'User-Agent': config.url.opt
    }
    superagent
        .get(url)
        .set(opt)
        .end(function (err,res) {
            if(err){
                console.log(err)
            }
            else{
                var $ = cheerio.load(res.text);
                var links = $('#search_jobtype_tag a').toArray();
                for(var i = 2 ; i < links.length ; i++){
                    var caree =  {};
                    var type=$(links[i]).attr('href').split("&");
                    caree.code=type[type.length-1].split('=')[1];
                    caree.name = $(links[i]).text().split('(')[0];
                    caree.number =parseInt( $(links[i]).text().split('(')[1].split(')')[0]);
                    job.push(caree)
                }
                console.log(job)
            }
        })
}

start()












