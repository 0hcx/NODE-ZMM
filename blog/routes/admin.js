var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var formidable = require('formidable');
var entries = require('../db/jsonRes');


//渲染新建新闻页面
router.get('/news', function(req, res, next) {
  res.render('./admin/news', {
    title: 'Express',
    layout: 'admin' ,
    user: req.session.user
  });
});
//创建新闻
router.post('/news', function(req, res, next) {
  dbHelper.addNews(req.body, function (success, doc) {
    res.send(doc);
  })
});


//渲染新闻列表页面
router.get('/newsList', function(req, res, next) {
  var msg = req.session['message'] || '';
  req.session['message'] = "";//写入session
  
  dbHelper.findNews(req, function (success, data) {
    res.render('./admin/newsList', {
      entries: data.results,
      pageCount: data.pageCount,
      pageNumber: data.pageNumber,
      count: data.count,
      layout: 'admin',
      message: msg,
      user: req.session.user

    });
  })
});


//删除新闻
router.get('/newsDelete/:id', function(req, res, next) {
  var id = req.params.id;
  dbHelper.deleteNews(id, function (success, data) {
    req.session['message'] = data.msg;
    res.redirect("/admin/newsList");
  })
});


//渲染新建新闻页面
router.get('/moocList', function(req, res, next) {
  dbHelper.findMooc(req, function (success, data) {
    res.render('./admin/moocList', {
      entries: data.results,
      pageCount: data.pageCount,
      pageNumber: data.pageNumber,
      count: data.count,
      layout: 'admin',
      user: req.session.user

    });
  })

});

//渲染新建慕课页面
router.get('/moocCreate', function(req, res, next) {
  res.render('./admin/moocCreate', { layout: 'admin' });
});

router.post('/moocCreate', function(req, res, next) {
  dbHelper.addMooc(req.body, function (success, doc) {
    res.send(doc);
    user: req.session.user

  })
});

//渲染编辑慕课页面
router.get('/moocEdit/:id', function(req, res, next) {

  var id = req.params.id;
  dbHelper.findMoocOne( id,  function (success, doc) {
    res.render('./admin/moocEdit', { entries: doc, layout: 'admin' });
  })
});

router.post('/moocGetChapContent', function(req, res, next) {

  var moocId    = req.body.moocId;
  var chapId    = req.body.chapId;
  var preChapId = req.body.preChapId;
  var content   = req.body.content;

  dbHelper.findMoocChapContent( moocId, chapId, preChapId, content, function (success, doc) {
    res.send(doc);
  })
});


router.post('/moocSetChapTitle', function(req, res, next) {

  var moocId    = req.body.moocId;
  var chapTitle = req.body.chapTitle;
  var chapId    = req.body.chapId;

  dbHelper.updateMoocChapTitle( moocId, chapId, chapTitle, function (success, doc) {
    res.send(doc);
  })
});


router.post('/moocGetChapTitle', function(req, res, next) {

  var moocId    = req.body.moocId;
  var chapId    = req.body.chapId;

  dbHelper.queryMoocChapTitle( moocId, chapId, function (success, doc) {
    res.send(doc);
  })
});

router.post('/moocDeleteChap', function(req, res, next) {

  var moocId    = req.body.moocId;
  var chapId    = req.body.chapId;

  dbHelper.deleteMoocChap( moocId, chapId, function (err, doc) {
    if(err) {
      return next(err);
    }else{
      res.send(doc);
    }
  })
});


router.post('/moocAddChap', function(req, res, next) {

  var moocId    = req.body.moocId;
  var chapId    = req.body.chapId;

  dbHelper.addMoocChap( moocId, chapId, function (err, doc) {
    if(err) {
      return next(err);
    }else{
      res.send(doc);
    }
  })
});


router.post('/moocUpChap', function(req, res, next) {

  var moocId    = req.body.moocId;
  var chapId    = req.body.chapId;

  dbHelper.upMoocChap( moocId, chapId, function (err, doc) {
    if(err) {
      return next(err);
    }else{
      res.send(doc);
    }
  })
});

router.post('/moocDownChap', function(req, res, next) {

  var moocId    = req.body.moocId;
  var chapId    = req.body.chapId;

  dbHelper.downMoocChap( moocId, chapId, function (err, doc) {
    if(err) {
      return next(err);
    }else{
      res.send(doc);
    }
  })
});

  module.exports = router;
