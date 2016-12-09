var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs      = require('express-handlebars');
var hbsHelper = require('./lib/hbsHelper');
var mongoose = require('mongoose');
var config = require('./config');
var dbHelper = require('./db/dbHelper');
var routes = require('./routes/index');
var admin = require('./routes/admin');
var session     = require('express-session');
var authority = require('./db/authority');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//配置hbs基础模板和分块模板
var hbs = exphbs.create({
  partialsDir: 'views/partials',
  layoutsDir: "views/layouts/",
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: hbsHelper //important
});
app.engine('hbs', hbs.engine);

// //连接数据库
// try {
//     mongoose.connect(config.db.url);
// } catch (error) {
//     console.log(error);
// }

//配置解析器，静态资源映射
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));

config.site.path = path.join(__dirname, 'public');

//加入session支持
app.use(session({
  name:'OnlineTest',//表示cookie的name，默认cookie的name是：connect.sid。
  maxAge: 30 * 1000,//cookie过期时间，毫秒。
  secret: 'mia-web-node-secret-key',//用来对session数据进行加密的字符串.这个属性值为必须指定的属性。
  resave: false,//每次请求都重新设置session cookie,过期,请求都会再设置。
  saveUninitialized: false//每次请求都设置个session cookie ，默认给个标示为 connect.sid
}));

app.use('/', routes);
app.use('/', authority.isAuthenticated, require('./routes/index'));
// app.use('/', authority.isAuthenticated, require('./routes/admin'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('./error/404', {layout: 'error'});
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('./error/500', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('./error/500', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
