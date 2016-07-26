#学习报告
##知识点总结
###http协议
####1.绝对地址和相对地址  
#####1.1绝对URL  
绝对URL（absolute URL）显示文件的完整路径，这意味着绝对URL本身所在的位置与被引用的实际文件的位置无关。  
#####1.2相对URL    
包含URL本身的文件夹的位置为参考点，描述目标文件夹的位置。    
*  `.`：代表目前所在的目录，相对路径。  
*  `..`：代表上一层目录，相对路径。   
*  `../../`：代表的是上一层目录的上一层目录，相对路径。  
*  `/`：代表根目录，绝对路径。 
>href 和 src 的定义与区别
>>src (Source)属性仅仅嵌入当前资源到当前文档元素定义的位置
>>href (Hypertext Reference))指定网络资源的位置[参考](http://stackoverflow.com/questions/3395359/difference-between-src-and-href)
```
To refer a CSS file: href="cssfile.css" inside the link tag.
To refer a JS file: src="myscript.js" inside the script tag.
To refer an image file: src="mypic.jpg" inside an image tag.
To refer another webpage: href="http://www.webpage.com"
```
####2.querystring   
querystring是node.js和参数相关的工具类,node.js原生自带,直接 require('querystring') 即可使用.
```js
//obj就是要格式化的对象,[options]表示可选参数, [sep]指分隔符(默认&),[eq]指分配符(默认=),obj{}
querystring.stringify(obj, [sep], [eq]) //对象格式化成参数字符串(序列化)
querystring.parse(str, [sep], [eq], [options])//参数字符串格式化成对象(反序列化)，option默认参数为1000个，maxKeys <number>属性值将其设为0，那么就没有个数限制了
querystring.escape  //转译
querystring.unescape //反转译
//例子
var param="哈哈";
console.log(querystring.escape(param));
console.log(querystring.unescape(querystring.escape(param)));
```
####3.URL和URI  
URI，uniform resource identifier，统一资源标识符，用来唯一的标识一个资源。可绝对，可相对，符合语法即可

URL,uniform resource locator，统一资源定位器，它是一种具体的URI。不能是相对的，schema必须被指定。
####4.http status code( 理解HTTP之常见的状态码 )
RFC2616定义的状态码，由3位数字和原因短信组成。
数字中的第一位指定了响应类别，后两位无分类。响应类别有以下5种：

| Type|Reason-phrase (类别)           | Note(原因短语)                 |
| ----|:-----------------------------:|:------------------------------:|
|1XX  |Informational(信息性状态码)    | 表示接受的请求正在处理         |
|2XX  |Success(成功状态码)            | 表示请求正常处理完毕           |
|3XX  |Redirection(重定向状态码)      | 表示需要客户端需要进行附加操作 |
|4XX  |Client Error(客户端错误状态码) | 表示服务器无法处理请求         |
|5XX  |Server Error (服务器错误状态码)| 表示服务器处理请求出错         |

[参考](https://segmentfault.com/a/1190000004869057#articleHeader16)
###5.http verbs  
* get
* post
* delete
* put
```
// respond with "Hello World!" on the homepage
app.get('/user:id', function (req, res) {
  res.send('Hello World!');
});

// accept POST request on the homepage
app.post('/user/create', function (req, res) {
  res.send('Got a POST request');
});

// accept PUT request at /user
app.put('/user/:id', function (req, res) {
  res.send('Got a PUT request at /user');
});

// accept DELETE request at /user
app.delete('/user/:id', function (req, res) {
  res.send('Got a DELETE request at /user');
});
```
[详细](https://segmentfault.com/a/1190000004356398#articleHeader11)
####6.表单和ajax传值  
####7.req取参数的3种方法
* req.params
* req.body
* req.query  

#####7.1. req.params  
这是一个数组对象，命名过的参数会以键值对的形式存放。 比如你有一个路由`/user/:name,`
` name`属性会存放在`req.params.name.` 这个对象默认为 `{}`.
```js
// GET /user/tj
req.params.name
// => "tj"
app.post('/user/signup/:userid',function(req,res){
  req.params.userid;
})
```
当使用正则表达式定义路由的时候，`req.params[N]`会是这个应用这个正则后的捕获分组, 
N是代表的是第N个捕获分组。这个规则同样适用于全匹配的路由，如 `/file/*`
```js
// GET /file/javascripts/jquery.js
req.params[0]
// => "javascripts/jquery.js"
```
#####7.2. req.body  
`req.body`是配合`Express`中间件`bodyParser()`中间件提供的。当`bodyParser()`中间件使用后，这个对象默认为
`{}`,`req.body`可以获取到post到body中的内容。
```js
app.post('/user/signup',function(req,res){
  var _user = req.body.user;
})
// POST user[name]=tobi&user[email]=tobi@learnboost.com
req.body.user.name
// => "tobi"
req.body.user.email
// => "tobi@learnboost.com"
// POST { "name": "tobi" }
req.body.name
// => "tobi"。
```

#####7.3. req.query  
```js
//query是querystring说明req.query不一定是get
// GET /search?q=tobi+ferret
req.query.q
// => "tobi ferret"
// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
req.query.order
// => "desc"
req.query.shoe.color
// => "blue"
req.query.shoe.type
// => "converse"
```
因为有变态的写法  
```js
// POST /search?q=tobi+ferret
{a:1,b:2}
req.query.q
// => "tobi ferret"
```
总结出以下4点：  
1、对于`path`中的变量，均可以使用`req.params.xxxxx`方法  
2、对于`get`请求的`?xxxx=`,使用`req.query.xxxxx`方法  
3、对于`post`请求中的变量，使用`req.body.xxxxx`方法  
4、以上三种情形，均可以使用`req.param()`方法，所以说`req.param()`是`req.query`、`req.body`、以及`req.params`获取参数的三种方式的封装。
***
###express
####1.基本框架结构
* node_modules：Web项目的模块管理
* package.json：项目的配置文件（可定义应用程序名，版本，依赖项等等，node_modules文件夹下的依赖项来源）
* public文件夹(包含images、javascripts、stylesheets)
* routes文件夹(存放路由文件)
* views文件夹 (用于存放模版文件)
####2.路由的基本原理和中间件 
当express实例的路由越来越多的时候，最好把路由分类独立出去，express的实例(app)能更好的处理其他逻辑流程。
Express的Router对象是一个简化的 app实例，只具有路由相关的功能，包括use, http verbs等等。
最后这个Router再通过app的use挂载到app的相关路径下。
　路由的产生是通过HTTP的各种方法(GET, POST)产生的，Middleware可以跟router路径跟特定的HTTP方法绑定，也可以跟所有的方法绑定。
先从app.js看起
```js
//1.app.set(name,value)
app.set('views', path.join(__dirname, 'views')); //设置了模版文件夹的路径,__dirname表取当前执行文件的路径
app.set('view engine', 'ejs');  //设置使用的模版引擎
// 通过express应用的use（all），把Middleware同router路径上的所有HTTP方法绑定：
//2.app.use([path], function)
var users = require('./routes/users');
app.use('/users', users);///users访问时，调用routes目录下users.js文件
//通过express应用的http.verb，把Middleware同router路径上的特定的HTTP方法绑定：
//3.app.get(name)//获取名为name的项的值
app.get('/', function(req, res){
  res.send('hello world');
});
app.post('/', function(req, res){  
  res.send('hello world'); })
//4.路由文件index.js
router.get('/homepage', function(req, res, next) {
  res.render('homepage', { newList: 'Express', layout: 'main' });//render表示调用模版引擎解析名
});
```
####3.静态数据的操作处理
通过 Express 内置的`express.static`可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
```js
app.use(express.static(path.join(__dirname, 'public')));//现在，public 目录下面的文件就可以访问了。
//所有文件的路径都是相对于存放目录的，因此，存放静态文件的目录名不会出现在 URL 中。
```
####4.错误处理与防止服务器崩溃
* 使用 try-catch
Try-catch 是一种 JavaScript 语言构造，可用于捕获同步代码中的异常。例如，使用 try-catch 来处理 JSON 解析错误（如下所示）。

使用诸如 JSHint 或 JSLint 之类的工具有助于查找类似未定义变量的引用错误这样的隐含异常。
```js
app.get('/search', function (req, res) {
  // Simulating async operation
  setImmediate(function () {
    var jsonStr = req.query.params;
    try {
      var jsonObj = JSON.parse(jsonStr);
      res.send('Success');
    } catch (e) {
      res.status(400).send('Invalid JSON string');
    }
  });
});
//try-catch 仅适用于同步代码。而由于 Node 平台主要采用异步方式（尤其在生产环境中），因此 try-catch 不会捕获大量异常
```
* 使用 promise
Promise 可以处理使用 then() 的异步代码块中的任何异常（显式和隐式）。只需将 .catch(next) 添加到 Promise 链的末尾。例如：
```js
app.get('/', function (req, res, next) {
  // do some sync stuff
  queryDb()
    .then(function (data) {
      // handle data
      return makeCsv(data)
    })
    .then(function (csv) {
      // handle csv
    })
    .catch(next);
});

app.use(function (err, req, res, next) {
  // handle error
});

```
[参考网站](http://expressjs.com/zh-cn/advanced/best-practice-performance.html#promises)
***
###常用中间件
####1.session的基本使用方法
####2.cookie的基本使用方法
####3.log日志的处理方法
####4.nodepdf转换模型
####5.formidable图片上传模块
`详见项目进程`
***
###handlebar 
####1.了解handlebar的基本处理方法{{v}},{{{v}}},{{>v}}
#####handlebars 表达式
```css
<h1>{{title}}</h1>  <!-- 在上下文中找 title 属性，获取它的值 -->
```
#####点分割表达式
```css
<h1>{{article.title}}</h1>  
```
tip:不合法的标识符用 “[]” 包装
```css
{{#each articles.[10].[#comments]}}
  <h1>{{subject}}</h1>
  <div>
    {{body}}
  </div>
{{/each}}
```
####2.了解partials模型，掌握组织页面结构
####3.了解基本块的处理方法，with/each/list/if
#####with helper
根据模板传递的上下文解析模板
```css
<div class="entry">  
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>  
```
当 JSON 对象包含嵌套属性时，不必再三重复父属性的名字。比如以下数据：
```css
{
  title: "First Post",
  story: {
    intro: "Before the jump",
    body: "After the jump"
  }
}
```
helper 接收参数，参数为 JSON 属性的 上下文。
```
Handlebars.registerHelper('with', function(context, options) {  
  return options.fn(context);
});
```
#####简单迭代器 each helper
Handlebars 内建了　each　迭代器
```css
<div class="comments">  
  {{#each comments}}
    <div class="comment">
      <h2>{{subject}}</h2>
      {{{body}}}
    </div>
  {{/each}}
</div>  
```
实现原理如下：　把 comments 数组的每一个元素作为上下文解析模板
```js
Handlebars.registerHelper('each', function(context, options) {  
  var ret = "";

  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }

  return ret;
});
```
可以用 this 引用迭代元素
```csws
<ul class="people_list">  
  {{#each people}}
  <li>{{this}}</li>
  {{/each}}
</ul>  
```
上下文：

{
  people: [
    "Yehuda Katz",
    "Alan Johnson",
    "Charles Jolley"
  ]
}
结果：
```css
<ul class="people_list">  
  <li>Yehuda Katz</li>
  <li>Alan Johnson</li>
  <li>Charles Jolley</li>
</ul> 
``` 
当某一项为空时，可以用{{else}}表达式
```css
{{#each paragraphs}}
  <p>{{this}}</p>
{{else}}
  <p class="empty">No content</p>
{{/each}}
```
通{{@index}}可以引用当前的循环索引
```css
{{#each array}}
  {{@index}}: {{this}}
{{/each}}
```
用{{@key}}引用当前的键名：
```
{{#each object}}
  {{@key}}: {{this}}
{{/each}}
```
数组迭代的第一步和最后一步用 @first 和 @last 变量表示， 对象迭代时仅 @first 可用。
#####条件语句 if helper
如果条件参数返回 false, undefined, null, "" 或 []（非真的值）时，Handlebars 将不渲染该块
Handlebars 内建了 if 和 unless 语句
```css
{{#if isActive}}
  <img src="star.gif" alt="Active">
{{/if}}
```
实现原理：根据传入的条件参数，判断是否解析模板
```js
Handlebars.registerHelper('if', function(conditional, options) {  
  if(conditional) {
    return options.fn(this);
  }
});
```
Handlebars 还提供了 else 语句
```css
{{#if isActive}}
  <img src="star.gif" alt="Active">
{{else}}
  <img src="cry.gif" alt="Inactive">
{{/if}}
```
####4.了解如何使用helper
***
###数据库的相关操作（mongoose）
####1.crud(增删查改)
####2.了解分页
####3.了解关系（1对1，1对多）在mongoose里如何实现
####4.了解statics方法和methods的区别
####5.了解pre和post的差别
####6.了解mvc里m的作用，以及什么样的代码应该放到模型里
####7.了解索引优化
***
###promise/a+规范，合理规避回调陷阱
####1.了解node的异步
####2.了解异步基本场景，如何处理事务，使用async的parallel和waterfall处理异步
####3.了解如何重构流程，以及代码的可读性
***
###代码调试
####1.node-inspector
####2.webstorm内置调试方法
http://i5ting.github.io/node-debug-tutorial/
***
###消息处理
####1.socket-io
####2.复杂消息系统 设计
####3.状态机逻辑
***
##项目进程
***
##2016/6/29
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

2.开放接口
```
module.exports = mongoose.model('User', userSchema);
```

3.监听事件
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
      'usr': $("#usr").val(),//用于从一个对象解析出字符串!
      'pwd': $("#pwd").val()//改变当前地址
    }),
    success: function(result) {
      if (result.code == 99) {//表示成功
        $(".login-box-msg").text(result.msg);
      } else {
        $.cookie('username', result.data.username, {expires:30});
        //将result.data.username写入cookies中的username去
        ...
        location.href = "/blog";
      }
    }
  })
}
```  
4.findUsr
```js
exports.findUsr = function(data, cb) {
    User.findOne({
        username: data.usr
    }, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';
        //将user转为一个对象(在密码和用户名匹配的前提下)
       else if (user.password === data.pwd) {
         ....
            cb(true, entries);
}
```

5.添加路由
```js
router.get('/login', function(req, res, next) {
    res.render('login', { layout: 'lg' });
});

router.post('/login', function(req, res, next) {
    dbHelper.findUsr(req.body, function (success, doc) {//`callback`函数
        res.send(doc);
    })
});
```
***
##2016/7/2
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
webHelper跟highlight有关系,但是好像有问题  
5.admin.js
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
##2016/7/4
###网页发布一些问题的解决  
formatDate&timeFromNow
这两个都是用来对时间进行格式化，但是系统报错说无法识别，经检验在`var hbs = exphbs.create`加入`helpers: hbsHelper`
###网页布局的改变
在原来基础上，我加了homepage，将新闻发布放在/news下
***
##2016/7/6
###注册功能
```js
exports.addUser = function(data, cb) {
    if (data.usr === "") {                //未输入用户名
        entries.code = 99;
        entries.msg = '请输入用户名 ！';
        cb(false, entries);
    }
    else if (data.password === "") {...} //未输入密码
    else if (data.email === "") {...}    //未输入邮箱
    else {User.findOne({username: data.usr}, function (err, usr) {
            if (err) { ...}
            else if (usr) {...}          //当用户存在
              else {
                var user = new User({...});
                user.save(function (err, usr) {
                    if (err) {...}
                    else {
                        entries.code = 0;
                        entries.msg = '注册成功 ！';
                        cb(true, entries);
                        ...
```
***
##2016/7/6
###集成Markdown编辑器并渲染显示
在项目中集成Markdown，最简单的方法就是直接放一个textarea，然后后台通过`remarkable`进行渲染。
这里有一个Remarkable在线演示示例：<https://jonschlinkert.github.io/remarkable/demo/>
####使用Remarkable
为了能够支持代码高亮，所以用到了另外一个中间件`highlight`  
1.首先安装集成  
```js
npm install --save remarkable
npm install --save highlight.js
```
2.定义
```js
var Remarkable = require('remarkable');
var hljs = require('highlight.js');
```
```js
 Remarkable: function () {
        return new Remarkable('full', {
            linkify: true,         // 自动转换链接
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {return hljs.highlight(lang, str).value;
                    } catch (err) {
                    }
                }try {
                    return hljs.highlightAuto(str).value;
                } catch (err) {}
               return ''; // 使用外部默认溢出
            }
        });
    }
};
```
3.使用
```js
var md = webHelper.Remarkable();
data.content = md.render(data.content);
```
4.前台正常渲染代码高亮(这个好像可以不用欸)  
在前台我们还需要在前台引入highlight.js的相关css。
```html
<link rel="stylesheet" href="/stylesheets/default.css">
<script src="/js/highlight.js"></script>
```
出现问题：无法识别标题的那个＃  
[参考网页](http://www.jianshu.com/p/2a533f47a6d7)
***
##2016/7/9
###分页关键代码的理解
1.后端
```js
exports.pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page//当前页码
    };
    async.parallel({//并行:parallel 
                   //的原理是同时并行处理每一个流程,最后汇总结果,如果某一个流程出错就退出.
        count: function (done) {  // 查询数量
            Model.exec(function (err, count) {  
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录
            Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(
            sortParams).exec(function (err, doc) {
                done(err, doc);//通过skip,limit进行分页。
// 关于skip效率问题，10W以下的记录，是可以接受的，10w以上的记录需要根据排序的字段，通过索引定位查询
            });
        }
    }, function (err, results) {
        var newsList=new Array();
        for(var i=0;i<results.records.length;i++) {
            newsList.push(results.records[i].toObject());
        }
        var count = results.count;
        $page.pageCount = parseInt((count - 1) / pageSize + 1);//算总页数
        $page.results = newsList;//当前页的记录
        $page.count = count;
        callback(err, $page);
    });
};
```
2.前端
```css
<div class="box-footer">
    <nav>
      <ul class="pagination"><!-- 引入pagination类,用于分页 -->
        <li>
          <a href="{{#le pageNumber 1}}?{{else}}?page={{reduce pageNumber 1}}{{/le}}"
            aria-label="Previous"><!-- 如果数据有前页,那个上一页的按钮有效 -->
           <span aria-hidden="true">&laquo;</span><!-- 转义字符<< -->
          </a>
        </li>
        {{#times pageCount 1 pageCount}}<!-- 进入分页展示 -->
        <li {{#equals pageNumber this.step}}class="active" {{/equals}}><!-- 当前页 -->
          <a href="?page={{step}}{{#if recommend}}&recommend={{recommend}}{{/if}}{{#if type}}&type={{type}}{{/if}}">{{step}}</a>
        </li>
         {{/times}}
        <li>
          <a href="{{#ge pageNumber pageCount}}?page={{pageCount}}{{else}}?page={{add pageNumber 1}}{{/ge}}"
          aria-label="Previous">
            <span aria-hidden="true">&raquo;</span><!-- 转义字符>> -->
          </a>
        </li>
      </ul>
    </nav>
</div>
```
`news.js`用户定义，`newsAdmin.js`定义ajax对象，`dbHelper.js`实现联系前两者，在`index.js`.添加路由，在
`news.hbs`应用渲染到前端(运算符在`hbsHelper.helper`中定义)。
*** 
##2016/7/12
###图片代码理解
####前端
```js
function init() {
  var socket = io();
  socket.on('uploadProgress' , function(percent){
    console.log(percent);
    $(".pg-bar").progressbar( "option", "value", parseInt(percent));
    $(".pg-info").text( percent + '%');
  });
  $(".pg-bar").progressbar({value: 0});
  $(".pg-bar").progressbar( "option", "max", 100 );
  $("body").on('click', '#addNewsBtn', doAddNews);
  $("body").on('click', '#UploadBtn', doUpload);
  $("body").on('change', '#uploadFile', preUpload);
}

function preUpload() {
  $("#UploadBtn").removeClass('disabled');//上传按钮生效
}
function doUpload() {
  $(".pg-wrapper").show();//进度条显示
  var file = $("#uploadFile")[0].files[0];
  var form = new FormData();
  form.append("file", file);
  $.ajax({
    url: "/admin/uploadImg",
    type: "POST",
    data: form,
    async: true,
    processData: false,
    contentType: false,
    success: function(result) {
      startReq = false;
      if (result.code == 0) {
        var picUrl = $.format("![Alt text]({0})",result.data);
        $("#newsContent").insertAtCaret(picUrl);//插入图片
        $(".pg-wrapper").hide();//进度条图层隐藏
        // console.log(result.data);
      }
    }
  });
}
```
####后端
```js
var formidable = require('formidable');//载入 formidable
router.post('/uploadImg', function(req, res, next) {
  var io = global.io;
  var form = new formidable.IncomingForm();//创建新的表单
  var path = "";
  var fields = [];
  form.encoding = 'utf-8';//编码方式
  form.uploadDir = "./public/upload";//保存路径
  form.keepExtensions = true;//包含源文件的扩展名
  form.maxFieldsSize = 30000 * 1024 * 1024;//限制的内存量。如果超过此值，“错误”事件被发射。
  var uploadprogress = 0;//进度条
  console.log("start:upload----"+uploadprogress);
  form.parse(req);//会转换请求中所包含的表单数据
  form.on('field', function(field, value) {//每当一个字段/值对已经收到时会触发该事件
    console.log(field + ":" + value); //上传的参数数据
  })
      .on('file', function(field, file) {//每当文件已经接收到，便会触发该事件
        path = '\\' + file.path; //上传文件路径
      })
      .on('progress', function(bytesReceived, bytesExpected) {//当有数据块被处理之后会触发该事件，对于创建进度条非常有用。
        uploadprogress = (bytesReceived / bytesExpected * 100).toFixed(0);//计算进程
        console.log("upload----"+ uploadprogress);
        io.sockets.in('sessionId').emit('uploadProgress', uploadprogress);
      })
      .on('end', function() {// 当所有的请求已经接收到，且所有的文件都已上传到服务器中，该事件会触发。
        console.log('-> upload done\n');// //上传完发送成功的json数据
        entries.code = 0;
        entries.data = path;
        res.writeHead(200, {
          'content-type': 'text/json'
        });
        res.end(JSON.stringify(entries));
      })
      .on("err",function(err){//当上传流中出现错误便会触发该事件
        var callback="<script>alert('"+err+"');</script>";
        res.end(callback);//这段文本发回前端就会被同名的函数执行
      }).on("abort",function(){
    var callback="<script>alert('"+ttt+"');</script>";
    res.end(callback);
  });
});
```

[参考网站](http://www.cnblogs.com/yuanke/archive/2016/02/26/5221853.html)
##2016/7/10
###文件上传
遇到的问题：进度条没有加载,socket没连上  
解决方法：
`admin.js`里面`var io = global.io`
这里的`io`就是传说中的全局变量，要在`www`初始化，保存到全局，然后传给`router`，原来是这样子！
***  
##2016/7/11
###文件显示问题
遇到的问题：图片无法显示    
尝试1：发现如果把upload的文件放在public路径下面，图片可以显示。   
尝试2：将加载路径 改为"./public/upload";图片可以传进来啦，但是图片还是无法显示。  
思考：可能是路径配置有问题    
解决方法：将`app.use(express.static(path.join(__dirname, '/')));`加入app.js。  
解释：静态文件从应用程序目录中的“根目录”目录中的应用静态内容  
[参考网站](http://expressjs.com/en/api.html)  
***
***  
###pdf  
问题1:出现error：conversation failed with exits of 1  
解决方法:在terminal打上`npm install phantomjs -g`

问题2：pdf显示全部数据，而不是单条数据  
解决方法：新建一个blog.hbs,改变pdf的路由  

问题3：发布成功后，不能跳转到相应id的路径上，是unsigned  
思考：`location.href = '/pdf/blogPdf/'+ result.data._id;`这里参数没有传进来  
暂未解决  
[参考网站](http://yijiebuyi.com/blog/be234394cd350de16479c583f6f6bcb6.html)  

##2016/7/13
###pdf
####问题解决  
1. docs对象为空  
原因：` var docs = (docs !== null) ? docs.toObject() : '';`这句报错。内容：`toObject() is undefined`  
解决：不用`toObject()`函数,直接可以取比如`doc._id`。这是model对象的一个特点.

2.页面跳转id并未传入    
```js
entries.data = doc.toObject();//addnews时将doc转为对象，并将数据传给entries
cb(true,entries);
location.href = '/pdf/blogPdf/'+ result.data._id;//回掉函数返回
```
####理解
[参考网站1](https://github.com/TJkrusinski/NodePDF)  
[参考网站2](http://phantomjs.org/api/webpage/property/cookies.html)
***
##2016/7/14
###加入session支持
目的：获取当前用户的会话对象，以维护用户相关的信息。  
`session`的认证机制必须依赖`cookie`，所以还应该同时安装一个`cookie-parser`，然后再app.js中导入这两个中间件：  
```js
var cookieParser = require('cookie-parser');
var session = require('express-session');
```
定义cookie解析器，注意，该定义必须写在路由分配之前:  
```js
app.use(cookieParser());
app.use(session({
  name:'Blog',//表示cookie的name，默认cookie的name是：connect.sid。
  maxAge: 30 * 1000,//cookie过期时间，毫秒。
  secret: 'mia-web-node-secret-key',//用来对session数据进行加密的字符串.这个属性值为必须指定的属性。
  resave: false,//每次请求都重新设置session cookie,过期,请求都会再设置。
  saveUninitialized: false//每次请求都设置个session cookie ，默认给个标示为 connect.sid
}));
```
之后在处理请求时直接通过以下方式对session进行读写：  

```js
req.session['message'] = "";//写入session
res.redirect(req.session.lastpage);//从session中读取
```
##2016/7/16
###session的应用
应用一：登陆权限验证  
```js
module.exports = {
    isAuthenticated: function (req, res, next) {
        if(typeof(req.session.user) != 'undefined') {//查看session中user是否定义
            return next();
        }else{
            res.redirect('/login');//否则，跳转到登陆界面
        }
    }
};
```
应用二：支持socket.io  
```js
socket.join('sessionId');
```

应用三：新闻列表的消息提示  
```js
//路由渲染新闻列表时新建一个msg将其写入session
router.get('/newsList', function(req, res, next) {
  var msg = req.session['message'] || '';
  req.session['message'] = "";
  ....}
//执行操作的时候将信息写入msg
exports.deleteNews = function(id, cb) {
    News.findById(id, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                if (err) {
                    entries.msg = err;
                    cb(false,entries);
                }else{
                    entries.msg = '删除新闻成功！';
                    cb(true,entries);
            ....
//路由 如果msg不为空，则弹出框
$(init);
function init() {
  var msg = $(".box-msg").text();
  if (msg!=="") {
    notifyInfo(msg);
    $(".box-msg").text("");
  }
}
//前端 
<div class="box-msg hidden">{{message}}</div>
}
```
***
##2016/7/17
###jquery validate
目的：为表单提供了强大的验证功能，该插件捆绑了一套有用的验证方法，包括 URL 和电子邮件验证，也可自定义。
[官网](https://jqueryvalidation.org/)
####引入
```css
<script src="/lib/jquery/jquery.validate.js"></script>//导入js库
<script src="/lib/jquery/jquery.validate.messages_cn.js"></script>//中文信息提示包
```
####使用方式  
1、将校验规则写到控件中  
```css
<input type="text" class="form-control" placeholder="用户名" id="usr" required  minlength="3">
//要求必填且最小3个字母
```
2、将校验规则写到 js 代码中  
```js
 $("#signupForm").validate({
      rules: {
        firstname: "required",//必填
        lastname: "required",
        username: {
          required: true,
          minlength: 2
        }
```
[参考网站](http://www.runoob.com/jquery/jquery-plugin-validate.html)
##2016/7/20
###validate注意事项  
###button type="submit"的性质
1.`type=submit`是发送表单，使用`submit`后，页面支持键盘`enter`键操作,因此使用`submit`来提高页面易用性  
2.`Submit`将表单提交(`form.submit())`作为其onclick后的默认事件，提交时，所有具有`name`属性的`html`输入元素都将作为键值对提交，除了`Submit`对象。`Submit`对象只有在自己被单击后的提交中才会作为键值对被提交.  
###注册功能的完善
```js
<input type="email" class="form-control" placeholder="E-mail" id="new-email" name="email" required>
//要求输入邮箱满足一定的格式要求
...
<input type="password" class="form-control" placeholder="密码" id="new-pwd" required minlength="3" maxlength="10">
//要求密码满足一定的长度要求
```
***
##软件下载
***
##2016/6/28
###安装Node
打开[网址](https://nodejs.org/en/download/)，选择相对应的软件下载即可。一切准备好以后，打开命令提示符，进入 Node.js 源代码所在的目录进行编译。在 Release 子目录下面会有一个node.exe文件。
###npm的下载和使用
npm就是Node的软件包管理器，可以用它安装所需软件包并发布自己为nodejs写的软件包。[官网地址](http://npmjs.org)安装只需要在终端写入一行代码：`curl http://npmjs.org/install.sh | sh`
###OmniMarkupPreviewer插件安装
你可以在 Sublime Text 内通过 Package Control'shift+control+P'输入 Install Package 来安装 OmniMarkupPreviewer, 也可以从其 Github主页 [下载压缩包](http://theo.im/OmniMarkupPreviewer/)，解压到 Sublime Text 的 Packages 目录即可完成安装。或者自定义快捷键直接在浏览器中预览效果的话，可以自定义快捷键：
点击 Preferences --> 选择 Key Bindings User，输入：  
`{ "keys": ["alt+m"], "command": "markdown_preview", "args": {"target": "browser", "parser":"markdown"} }`  
保存后，直接输入快捷键：Alt + M 就可以直接在浏览器中预览生成的HTML文件了。
###MongoDB的安装和配置
####安装插件
1.下载plugins插件，放入对应路径  
2.在WebStorm的setting中添加路径  
3.重启WebStorm右上方出现mongo explorer  
4. 选择数据库，打开mongo explorer,添加数据库  
####安装
1.下载地址<http://www.mongodb.org/downloads>  
2.解压到文件夹(默认是C:\Program Files\MongoDB)  
3.创建文件夹dbpath和logpath，分别用来安装db和日志文件，在log文件夹下创建一个日志文件MongoDB.log  
4.运行cmd.exe进入命令界面，执行下列命令
  `cd C:\Program Files\MongoDB\Server\3.2\bin
  mongod -dbpath "E:\Web\db"`
运行通过，打开<http://localhost:27017/>  
####配置
安装服务命令
`mongod --dbpath "E:\Web\db" --logpath "E:\Web\logpath\MongoDB.log" --install --serviceName "MongoDB"`  
出现了一些问题。
措施：  
1.建立一个shell的文件夹  
2.建立一个startmongodb.bat的文件，内容：`mongod  --dbpath E:\Web\db`  
3.在系统path添加路径E:\Web\shell.  
##2016/7/10
###使用Sublime + PlantUML画图   
1. 插件导入  
1.1 Ctrl+Shift+P->add Repository->[uml](https://github.com/jvantuyl/sublime_diagram_plugin)->install package->sublime_diagram_plugin  
2. 环境变量配置
2.1 path:放Graphviz2.38的bin文件 
2.2 新添变量名：GRAPHVIZ_DOT，路径为bin文件下的dot.exe    
3. 测试plantuml.jar
3.1 打开diagram文件下plantuml-xxxx.jar ，打开cmd输入  
`java -jar plantuml-8024.jar -verbose test.txt`  
3.2 查看文件夹中多了一个png的图片，说明测试成功。  
4. 编码问题
某些情况下程序无法加载Diagram.sublime-settings文件，解决办法：  
打开package目录下的将sublime_diagram_plugin下的Diagram.sublime-settings，将第三行的null改为“UTF-8"
***
##读书笔记
***
