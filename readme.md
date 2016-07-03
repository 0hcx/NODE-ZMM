##学习报告
（2016/6/27）
###Node.js
是一个让 JavaScript 运行在服务端的开发平台
###小技巧——使用 supervisor
希望修改后立即看到效果，而不是每次都要终止进程并重启。
$ npm install -g supervisor
###异步式 I/O 与事件驱动
Node.js 最大的特点就是异步式 I/O（或者非阻塞 I/O）与事件紧密结合的编程模式。这
种模式与传统的同步式 I/O 线性的编程思路有很大的不同，因为控制流很大程度上要靠事件
和回调函数来组织，一个逻辑要拆分为若干个单元。当操作系统完成 I/O 操作时，以事件的
形式通知执行 I/O 操作的线程，线程会在特定时候处理这个事件。为了处理异步 I/O，线程
必须有事件循环，不断地检查有没有未处理的事件，依次予以处理。
优点:少了多线程的开销。
缺点:不符合人们一般的程序设计思维
###回调函数
####同步式
    将文件名作为参数传入 fs.readFileSync 函数，阻塞等待读取完成后，
    将文件的内容作为函数的返回值赋给 data 变量，接下来控制台输出 data 的值，最后输出 end.。
####异步式（发送请求）
    fs.readFile 接收了三个参数，第一个是文件名，第二个是编码方式，第三个是一个函数，
    我们称这个函数为回调函数。fs.readFile 调用时所做的工作只是将异步式 I/O 请求发送给了操作系统
    当 fs 接收到 I/O 请求完成的事件时，事件循环会主动调用回调函数以完成后续工作
###事件
由 EventEmitter 对象提供。事件循环机制（不可见）
###模块和包
require 函数来调用其他模块 
```js
var http = require('http')//不会重复加载模块
```
####获取
exports 是模块公开的接口，require 用于从外部获取一个模块的接口，即所获取模块的exports对象。
module.js require('./module') 加载这个模块 就可以直接访问 module.js 中 exports 对象的成员函数了
把一个对象封装到模块中
```js
module.exports = Hello 代替了 exports.Hello=Hello。只能通过指定module.exports 来改变访问接口。
```
####创建包
只要顶层目录下有 package.json 
###安装Node
打开(https://nodejs.org/en/download/)，选择相对应的软件下载即可。一切准备好以后，打开命令提示符，
进入 Node.js 源代码所在的目录进行编译。在 Release 子目录下面会有一个node.exe文件，这就是我们编译的唯一目标。
####Hello World！
 ```js
 var http = require('http'); 
 http.createServer(function (req, res) {   
 res.writeHead(200, {'Content-Type': 'text/plain'});     
 res.end('Hello World\n');   
 })
 .listen(1337, "127.0.0.1");   
 console.log('Server running at http://127.0.0.1:1337/');
 ```
创建个hello.js的文件，copy如上代码
###npm的下载和使用
npm就是Node的软件包管理器，可以用它安装所需软件包并发布自己为nodejs写的软件包。官网地址：npmjs.org
安装只需要在终端写入一行代码：
```　
curl http://npmjs.org/install.sh | sh
```

###Markdown的一些常见语法
####标题

`# `一级标题
`## `二级标题
`###` 三级标题
`####` 四级标题
`#####` 五级标题
`######` 六级标题
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
####代码添加
'字符'
or
`Tab`或四个空格（大段文字添加代码框，每行前添加）```
####图片添加
```
如![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)
```
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)
####引用
```
>a
>b
>>c
```
>a
>b
>>c
####链接
```
[参考网页](http://www.jianshu.com/p/21d355525bdf)
or
<链接>
```
[参考网页](http://www.jianshu.com/p/21d355525bdf)
####小型文本
```
<small>文本内容</small>
```
<small>文本内容</small>
##学习总结
2016/6/28
###OmniMarkupPreviewer插件安装
你可以在 Sublime Text 内通过 Package Control 输入 Install Package 来安装 OmniMarkupPreviewer, 也可以从其 Github主页 [下载压缩包](http://theo.im/OmniMarkupPreviewer/)，解压到 Sublime Text 的 Packages 目录即可完成安装。
或者
自定义快捷键
直接在浏览器中预览效果的话，可以自定义快捷键：点击 Preferences --> 选择 Key Bindings User，输入：
{ "keys": ["alt+m"], "command": "markdown_preview", "args": {"target": "browser", "parser":"markdown"} },
保存后，直接输入快捷键：Alt + M 就可以直接在浏览器中预览生成的HTML文件了。
###MongoDB的安装和配置
####安装插件
1.下载plugins插件，放入C:\Users\Zoe\.WebStorm2016.1\config\plugins
2.在WebStorm的setting中添加路径
3.重启WebStorm右上方出现mongo explorer
3. 选择数据库，打开mongo explorer,添加数据库
```
1.下载地址<http://www.mongodb.org/downloads>
2.解压到文件夹(默认是C:\Program Files\MongoDB)
3.创建文件夹dbpath和logpath，分别用来安装db和日志文件，在log文件夹下创建一个日志文件MongoDB.log，
4.运行cmd.exe进入命令界面，执行下列命令
  cd C:\Program Files\MongoDB\Server\3.2\bin
  mongod -dbpath "E:\Web\db"
运行通过，打开http://localhost:27017/

```
####配置
```
安装服务命令
mongod --dbpath "E:\Web\db" --logpath "E:\Web\logpath\MongoDB.log" --install --serviceName "MongoDB"
出现了一些问题
措施：
1.建立一个shell的文件夹
2.建立一个startmongodb.bat的文件，内容：mongod  --dbpath E:\Web\db
3.在系统path添加路径E:\Web\shell.
```
###Mongoose部分语法
####名词解释
Schema  ：  一种以文件形式存储的数据库模型骨架
Model   ：  由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
Entity  ：  由Model创建的实体，他的操作也会影响数据库
Mongoose的基本用法

1 . 将Mongoose集成到项目中
```
npm install --save mongoose
```
2 . 连接数据库
```js
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/blog');
```
3 . 定义一个Schema（也就是Mongodb中的Collections集合），更多字段类型，请参考SchemaTypes
```js
var userSchema = {
 username: {type: String, required: true, unique: true},
 password: {type: String, required: true}
}
```
4 . 将Schema进行“Model化”
```js
var User = mongoose.model('User', userSchema );
```
5 . 增加记录
```js
User.create({username: '张三', password: 'md5-pass'}, function(err, user){
 if(!err){
     console.log(user.username + ' 保存成功!');
 }else{
    console.log('数据保存失败：' + err);
 }
});
```
6 . 修改记录
```js
User.findOneAndUpdate({_id: req.params.userId}, {
 username: newUsername
}, function (err, raw) {
 if(!err) {
     console.log( '修改成功!');
 }else{
     console.log('修改失败');
 }
});
```
7 . 删除记录
```js
User.deleteById(userId, function(err, doc){
 if(!err){
     console.log('删除成功');
 }
});
```
8 . 查询记录
```js
User.findById(userId, callback);    // one record
User.findOne({username: '张三'}, callback);  // one record
User.find();  // multi records
```
9 . 查询记录集合
```js
User.find({'age' : 28},function(error,data) {
 console.log(data);
})
```
{}  : 无查询参数时默认查出表中所有数据
10 . entity保存方法,model调用的是create方法，entity调用的是save方法
```js
    var  Entity = new TestModel({});
    Enity.save(function(error,data){})
```
11 . 数据更新
```js
  var mongoose = require("mongoose");
  var db =mongoose.connect("mongodb://127.0.0.1:27017/test");
  var TestSchema = new mongoose.Schema({
    name : { type:String },
    age  : { type:Number, default:0 },
    email: { type:String },
    time : { type:Date, default:Date.now }
});
var TestModel = db.model("test1", TestSchema );
var conditions = {age : 26};
var update = {$set :{name : '小小庄'}};
TestModel.update(conditions,update,function(error,data){
    if(error) {
          console.log(error);
    }else {
          console.log(data);
      }
})
```
返回结果 ： { ok: 1, nModified: 1, n: 1 }
12 . 删除数据
```js
var conditions = { name: 'tom' };
TestModel.remove(conditions, function(error){
     if(error) {
           console.log(error);
     } else {
           console.log('Delete success!');
   }
});
```
13 . 简单查询方法 ---过滤

//返回一个只显示 name 和 email的属性集合
//id为默认输出,可以设置为 0 代表不输出
```js
 TestModel.find({},{name:1, email:1, _id:0},function(err,docs){
   console.log(docs);
 });
```
14 . 单条数据 findOne(Conditions,callback);
```js
  //查询符合条件的数据，结果只返回单条
  TestModel.findOne({},function(error,data){
          console.log(data);
  })
  TestModel.findOne({age:28},function(error,docs){
          console.log(docs);
  })
```
15 . 单条数据 findById(_id, callback);

  根据Id取数据findById，与findOne相同，但它只接收文档的_id作为参数，返回单个文档。
```js
  TestModel.findById('obj._id', function (err, doc){
           //doc 查询结果文档
 });
 ```
16 . 根据某些字段进行条件筛选查询，比如说 Number类型，怎么办呢，我们就可以使用$gt(>)、$lt(<)、$lte(<=)、$gte(>=)操作符进行排除性的查询
```js
  Model.find({"age":{"$gt":18}},function(error,docs){
           //查询所有nage大于18的数据
 });

  Model.find({"age":{"$lt":60}},function(error,docs){
         //查询所有nage小于60的数据
  });

  Model.find({"age":{"$gt":18,"$lt":60}},function(error,docs){
         //查询所有nage大于18小于60的数据
  });
```
总结

1. 查询：find查询返回符合条件一个、多个或者空数组文档结果。

2. 保存：model调用create方法，entity调用的save方法。

3. 更新：obj.update(查询条件,更新对象,callback)，根据条件更新相关数据。

4. 删除：obj.remove(查询条件,callback)，根据条件删除相关数据。
###hbs
####配置
index.js
```js
var exphbs =require('express-handlebars'); //引入 
```
```js
//配置hbs基础模板和分块模板  
var hbs = exphbs.create({  
  partialsDir: 'views/partials',  
  layoutsDir: "views/layouts/",  
  defaultLayout: 'main',          //默认布局模板为main.hbs
  extname: '.hbs'                 //默认文件后缀名为.hbs
});  

app.engine('hbs', hbs.engine);  

```
####渲染
layouts:利用{{>head}}  {{>body}}调用模块化代码
index.js：将login.hbs递交给layout: 'lg'
```js
router.get('/login', function(req, res, next) {
   res.render('login', { layout: 'lg' });
```
####静态文件目录映射
```js
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);                    //localhost:3000/ 映射到routes文件夹

app.use('/admin', admin);                //localhost:3000/admin映射到admin文件夹

```
####配置路由

app.use([path],function(req, res, next){})
1.如果该app.use()带有path参数，则匹配path参数才会执行该回调函数。
2.如果该app.use()的回调函数最后还调用了next方法，则这次请求的处理流程会继续流向下一个app.use()
app.get()\app.post()就能同时处理req和res，只是ExpressJS的把能同时处理req和res的称为路由（Routing）
```js
var express = require('express');//获取express模块，并且新建router
var router = express.Router();
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express' , layout:'main'} );
});
router.get('/login', function(req,res,next) {
    res.render('login',{ title: 'Express', layout:'lg'});
});
module.exports = router; //开放router的对外接口
```
###理解HTTP之常见的状态码
[参考网页](https://segmentfault.com/a/1190000005338367?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)
RFC2616定义的状态码，由3位数字和原因短信组成。
数字中的第一位指定了响应类别，后两位无分类。响应类别有以下5种：

| Type  |Reason-phrase| Note                                          |
| ------|:-----------:| ---------------------------------------------:|
| 1XX |Informational| 信息性状态码，表示接受的请求正在处理          |
|2XX  |Success    |成功状态码，表示请求正常处理完毕               |
|3XX  |Redirection  | 重定向状态码，表示需要客户端需要进行附加操作  |
|4XX  |Client Error | 客户端错误状态码，表示服务器无法处理请求      |
|5XX  |Server Error | 服务器错误状态码，表示服务器处理请求出错      |
---



***
##学习总结
2016/6/29
###登录功能的实现
1. 定义数据模型

```js
var Schema = mongoose.Schema;
/* 用户定义 */
var userSchema = new Schema({
    username: String,
    password: String,
    email:    String,
    address:  String,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});
```
2. 开放接口
```
module.exports = mongoose.model('User', userSchema);
```
3.ajax对象

将module转为ajax对象
```js
var user = (doc !== null) ? doc.toObject() : '';
```
事件监听
```js
$(init);

function init() {
  $("body").on('click', '#loginBtn', doLogin);
}

function doLogin() {
  $.ajax({
    type: "POST",
    url: "/login",//路径
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      'usr': $("#usr").val(),
      'pwd': $("#pwd").val()
    }),
    success: function(result) {
      if (result.code == 99) {//表示成功
        $(".login-box-msg").text(result.msg);
      } else {
        $.cookie('username', result.data.username, {expires:30});
        //将result.data.username写入cookies中的username去
        $.cookie('password', result.data.password, {expires:30});
        $.cookie('id', result.data._id, {expires:30});
        location.href = "/blog";
      }
    }
  })
}
```
4. 添加路由
```js
router.get('/login', function(req, res, next) {
    res.render('login', { layout: 'lg' });
});

router.post('/login', function(req, res, next) {
    dbHelper.findUsr(req.body, function (success, doc) {
        res.send(doc);
    })
});
```
###小结
在老师代码的基础上修改，然后应用到自己的，自己出现了一些问题，某些东西不是特别理解。
***
##学习总结
2016/6/30
###书写文档的一些喜欢问题
####sublime将hbs当html处理
View->Syntax->Open all with current extention->html
####选择时连接符问题
修改Setting-Uesr添加word separate
###登录模块的理解
1.首先申明`ajax`对象,
login.js
```js
function doLogin() {
  $.ajax({
    type: "POST",
    url: "/login",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      'usr': $("#usr").val(),
      'pwd': $("#pwd").val() //用于从一个对象解析出字符串!(soga)
    })
```
这部分cb返回结果，code=99表失败，code=0表示成功
```js
    success: function(result) {
      if (result.code == 99) {
        $(".login-box-msg").text(result.msg);
      } else {
        $.cookie('username', result.data.username, {expires:30});
        $.cookie('password', result.data.password, {expires:30});
        $.cookie('id', result.data._id, {expires:30});
        location.href = "/blog";
```
2.user.js(用户定义并开放接口)
3.index.js(入口文件)
'添加路由''
`callback`函数
```js
dbHelper.findUsr(req.body, function (success, doc) {
        res.send(doc);
    });
```
4.dbHelper.js
```js
exports.findUsr = function(data, cb) {
    User.findOne({
        username: data.usr
    }, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';
        //将user转为一个对象(在密码和用户名匹配的前提下)
       if (err) {
            console.log(err)
        } 
        else if
        ......
        } else if (user.password === data.pwd) {
            entries.data = user;
            entries.code = 0;
            cb(true, entries);
        }
    })
}
```
***
##学习总结
2016/7/1
###全局对象的属性
全局对象是最顶层的对象，在浏览器环境指的是 window 象，在 Node.js 指的是 global 对象
####VM
VM 是 node 中的一个内置模块，可以在文档中看到说明和使用方法。
大致就是将代码运行在一个沙箱之内，并且事先赋予其一些 global 变量。
而真正起到上述 var 和 global 区别的就是这个 vm 了。
vm 之中在根作用域（也就是最外层作用域）中使用 var 应该是跟在浏览器中一样，会把变量粘到 global（浏览器中是 window）中去。
我们可以试试这样的代码：
```js
var vm = require('vm');
var localVar = 'initial value';
vm.runInThisContext('var localVar = "vm";');
console.log('localVar: ', localVar);
console.log('global.localVar: ', global.localVar);
```
其输出结果是：
```
localVar: initial value
global.localVar: vm
```
so，vm 的一系列函数中跑脚本都无法对当前的局部变量进行访问。各函数能访问自己的 global，而 runInThisContext 的 global 与当前上下文的 global 是一样的，所以能访问当前的全局变量。
<小结
<在于 Node.js 的 vm 里面，顶级作用域下的 var 会把变量贴到 global 下面。而 REPL 使用了 vm。然后 $ node 进入的一个模式就是一个特定参数下面启动的一个 REPL。
<有或无var关键字声明的变量得到了连接到全局对象。这是通过声明的变量没有var关键字创造了节点的全局变量的基础。
有在Node.js的创建全局变量的两种方法，一种使用`全局对象`，而另一个使用`module.exports` 。建议:对于小型应用全局方法， module.exports为大型应用。
##学生总结
2016/7/2
###news发布大概流程
1.首先是 newsSchema的定义（db：schema:user.js）
```js
author: {
  type: Schema.Types.ObjectId,
  ref: 'User'
```
newsSchema 的属性 author，对应是一个 ObjectId 的数组。ref表示关联User
(注意: 被关联的model的 type 必须是 ObjectId, Number, String, 和 Buffer 才有效)。

2.然后是与之对应的json对象（/blog/newsAdmin.js）
```js
data: JSON.stringify({
  'usr': $("#usr").val(),
  'pwd': $("#pwd").val()
```
3.然后是两者之间的联系dbHelper.js
```js
exports.addNews = function(data, cb) {
     data.content = md.render(data.content); //这与highlight相关
      var news = new News({
        title: data.title,
        content: data.content,
        author:data.id
    }); 
     news.save(function(err,doc){
        if (err) {
            cb(false,err);
        }else{
            cb(true,entries);
        }
    })
};
```
4.Object类型的时，就是把 populate 的参数封装到一个对象里。如下，就是填充News的author字段
[参考网页](https://segmentfault.com/a/1190000002727265#articleHeader3)
```js
exports.findNewsOne = function(req, id, cb) {
    News.findOne({_id: id})
        .populate('author')
        .exec(function(err, docs) {
            cb(true,docs.toObject());
        });
};
```
hbsHelper跟time有关系
webHelper跟highlight有关系
5.routes里面index.js
```js
router.get('/blogs', function(req, res, next) {
  dbHelper.findNews(req, function (success, data) {
    res.render('blogs', { //blogs.hbs
      entries: data.results,
      pageCount: data.pageCount,
      pageNumber: data.pageNumber,
      count: data.count
    });
  })
});
```
6.admin.js
```js
router.get('/news', function(req, res, next) {
  res.render('./admin/news', { title: 'Express', layout: 'admin' });
});

router.post('/news', function(req, res, next) {
  dbHelper.addNews(req.body, function (success, doc) {
    res.send(doc);
  })
});
```
7.app.js加
```js
app.use('/', require('./routes/login'));
app.use('/pdf', require('./routes/pdf'));
app.use('/p', authority.isAuthenticated, require('./routes/index'));//这两个是表示认证过的意思
app.use('/admin', authority.isAuthenticated, require('./routes/admin'));
这个我不大懂，但是应该是要加进去的
//配置解析器，静态资源映射
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
```
###跳转
经测试
/XXX 会跳转到  http://域名:端口/XXX  
./XXX  会跳转到 当前路径+/XXX
XXX(../XXX) 会跳转到 当前路径父级+XXX
***
##学生总结
2016/7/2
###检测语法
jslint(http://www.jslint.com/)
###PlantUML高效地画图
###nodejs生成pdf文档
1.[PDF](http://pdfkit.org/)    
最专业的函数库，支持各种pdf文档的数据格式，只是使用起来比较复杂，适合专业开发者。
2.[Wkhtmltopdf](https://npmjs.org/package/wkhtmltopdf)
将HTML转化成pdf文档的引擎，使用起来非常方便简单
3.[PhantomJS](http://www.feedhenry.com/server-side-pdf-generation-node-js/) 
PhantomJS 是一个基于 WebKit 的服务器端 JavaScript API。它全面支持web而不需浏览器支持，其快速，原生支持各种Web标准： DOM 处理, CSS 选择器, JSON, Canvas, 和 SVG。 PhantomJS 可以用于 页面自动化 ， 网络监测 ， 网页截屏 ，以及 无界面测试 等。
###cookies和session区别
cookies：将状态数据保存在客户端
session：将状态数据保存在服务端
 应用场景
Cookie的典型应用场景是Remember Me服务，即用户的账户信息通过cookie的形式保存在客户端，当用户再次请求匹配的URL的时候，账户信息会被传送到服务端，交由相应的程序完成自动登录等功能。当然也可以保存一些客户端信息，比如页面布局以及搜索历史等等。
Session的典型应用场景是用户登录某网站之后，将其登录信息放入session，在以后的每次请求中查询相应的登录信息以确保该用户合法。当然还是有购物车等等经典场景；
具体到Web中的Session指的就是用户在浏览某个网站时，从进入网站到关闭浏览器所经过的这段时间，也就是用户浏览这个网站所花费的时间。因此从上述的定义中我们可以看到，Session实际上是一个特定的时间概念。
[参考](http://www.cnblogs.com/chenchenluo/p/4197181.html)