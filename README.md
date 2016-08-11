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
详见项目进程
***
###handlebar 
####1.了解handlebar的基本处理方法{{v}},{{{v}}},{{>v}}
#####{{v}}
1.1 handlebars 表达式
```css
<h1>{{title}}</h1>  <!-- 在上下文中找 title 属性，获取它的值 -->
```
1.2 点分割表达式
```css
<h1>{{article.title}}</h1> <!--  当前上下文找 article 属性，再找它的 title 属性 -->
```
#####{{{v}}}
```css
  <div class="body">
    {{{body}}}<!-- 不希望Handlebars来编码这些值 -->
  </div>
```
#####{{>v}}
```css
{{> partialName}}<!-- 引入局部模板，局部模板可以是字符串，也可以是编译模板的函数。 -->
```
####2.了解partials模型，掌握组织页面结构
比较推崇使用分页来实现组件化。分页跟helper一样需要先注册。在hbs模块中可以批量注册，比较简单。
```js
hbs.registerPartials(__dirname + '/views/partials');
```
当使用块级表达式时，我们通常添加`#`，而分页是`>`，
```js
{ {#> layout } }
  My Content
{ {/layout} }//layout分页不存在则显示块内的内容My Content。
```
####3.了解基本块的处理方法，with/each/list/if
####3.1 with
可以在模板的某个区域切换上下文，使用内置的 `with helper`即可。
```css
<div class="entry">
  <h1>{{title}}</h1>

  {{#with author}}
  <h2>By {{firstName}} {{lastName}}</h2>
  {{/with}}
</div>
```
在使用下面数据作为上下文时：
```js
{
  title: "My first post!",
  author: {
    firstName: "Charles",
    lastName: "Jolley"
  }
}
```
会得到如下结果：
```css
<div class="entry">
  <h1>My first post!</h1>

  <h2>By Charles Jolley</h2>
</div>
```
####3.2 each
你可以使用内置的`each helper`来循环一个列表，循环中可以使用`this`来代表当前被循环的列表项。
```css
<ul class="people_list">
  {{#each people}}
  <li>{{this}}</li>
  {{/each}}
</ul>
```
```js
{
  people: [
    "Yehuda Katz",
    "Alan Johnson",
    "Charles Jolley"
  ]
}
```
会得到：
```css
<ul class="people_list">
  <li>Yehuda Katz</li>
  <li>Alan Johnson</li>
  <li>Charles Jolley</li>
</ul>
```
so,可以使用`this`表达式在任何上下文中表示对当前的上下文的引用
还可以选择性的使用`else`，当被循环的是一个空列表的时候会显示其中的内容。
```css
{{#each paragraphs}}
  <p>{{this}}</p>
{{else}}
  <p class="empty">No content</p>
{{/each}}
```
在使用`each`来循环列表的时候，可以使用`{{@index}}`来表示当前循环的索引值。
```hbs
{{#each array}}
  {{@index}}: {{this}}
{{/each}}
```
对于`object`类型的循环，可以使用`{{@key}}`来表示：
```hbs
{{#each object}}
  {{@key}}: {{this}}
{{/each}}
```
####3.3 list
```js
{{#list people}}{{firstName}} {{lastName}}{{/list}}
```
并使用下面的上下文（数据）：
```js
{
  people: [
    {firstName: "Yehuda", lastName: "Katz"},
    {firstName: "Carl", lastName: "Lerche"},
}
```
此时需要创建一个 名为`list`的`helper`来生成这段`HTML`列表。这个`helper`使用`people`作为第一个参数，还有一个 `options`对象（hash哈希）作为第二个参数。这个`options`对象有一个叫`fn`的属性，你可以传递一个上下文给它（`fn`），就跟执行一个普通的`Handlebars`模板一样：
```js
Handlebars.registerHelper('list', function(items, options) {
  var out = "<ul>";
  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }
  return out + "</ul>";
});
```
执行之后，这个模板就会渲染出：
```css
<ul>
  <li>Yehuda Katz</li>
  <li>Carl Lerche</li>
  <li>Alan Johnson</li>
</ul>
```
####3.4 if
`if`表达式可以选择性的渲染一些区块。如果它的参数返回`false`,`undefined`, `0`,`null`, `""` 或 
`[]`（都是JS中的“假”值），`Handlebars`就不会渲染这一块内容：
```css
<div class="entry">
  {{#if author}}
  <h1>{{firstName}} {{lastName}}</h1>
  {{/if}}
</div>
```
当时用一个空对象（{}）作为上下文时，会得到：
```css
<div class="entry"></div>
```
在使用`if`表达式的时候，可以配合`{{else}}`来使用，这样当参数返回`假`值时，可以渲染`else`区块：
```css
<div class="entry">
  {{#if author}}
    <h1>{{firstName}} {{lastName}}</h1>
  {{else}}
    <h1>Unknown Author</h1>
  {{/if}}
</div>
```
####4.了解如何使用helper
`Handlebars`的`helpers`在模板中可以访问任何的上下文。可以通过`Handlebars.registerHelper`方法注册一个`helper`。
`Helpers`会把当前的上下文作为函数中的`this`上下文。
如果你不希望你的`helper`返回的`HTML`值被编码，就请务必返回一个`new Handlebars.SafeString`
参考网站：[英文](http://handlebarsjs.com/)，[中文](https://segmentfault.com/a/1190000000342636#articleHeader3)
***
###数据库的相关操作（mongoose）
####1.crud(增删查改)
#####1.1 增加记录
```js
TestModel.create({username: '张三', password: 'md5-pass'}, 
function(err, user){
 if(!err){
     console.log(user.username + ' 保存成功!');
 }else{
    console.log('数据保存失败：' + err);
 }
});
```
```js
var Entity = new TestModel({});
Enity.save(function(error,doc){
console.log(doc);});
```
>model调用的是create方法，entity调用的是save方法
#####1.2 删除记录
```
var conditions = { name: 'tom' };
TestModel.remove(conditions, function(error){
if(error) {
console.log(error);
} else {
console.log('Delete success!');
}
});
```
>删除： obj.remove(查询条件,callback)， 根据条件删除相关数据。
#####1.3 查询记录
```js
TestModel.find({'age' : 28},function(error,data) {
console.log(data);
})//无查询参数时默认查出表中所有数据
findOne(Conditions,callback);//单条数据查询
findById(_id, callback);//单条数据查询，但它只接收文档的_id作为参数
//可以使用$gt(>)、$lt(<)、$lte(<=)、$gte(>=)操作符进行排除性的查询
```
#####1.4 修改记录
```js
User.findOneAndUpdate({_id: req.params.userId}, {
 username: newUsername
}, function (err, raw) {
...
});
```
####2.了解分页
总结  
1.前端雏形bootstrap-paginator
2.后端查询mongoose
查询参数：    
>q，查询条件
>col，数据返回字段
>pageNumber，当前是第几页，如果不存在默认为第1页
r>esultsPerPage，每页多少条记录
分页的返回值    
>null：空错误，因为错误已经通过if处理了  
>pageCount：一共有多少页  
>results：数据结果集  

3.结果返回页面(后端->前端)    
>limit:5，每页限制5条记录  
>num:1，查询的页面  
>pageCount，一共有多少页  
>size，当前页面有多少条记录  
>numberOf，分页用几个标签显示  

4.查询参数传递(前端->后端)   
前端向后端：参数传递过程  
>通过javascript，从页面向控制器传参数p.  
>通过composeUrlParams函数，封装原表单的查询参数  
>通过pageUrl函数，拼接带分布的url请求  
后端向前端：参数传递过程  
>如果page1的div增加自定义属性  
>在页面渲染时，通过js解析div增加自定义属性，赋值给bootstrap-paginator控件 

5.完整展现  
[参考网站](http://blog.fens.me/nodejs-bootstrap-paginator/)  
代码详见项目进度  
####3.了解关系（1对1，1对多）在mongoose里如何实现
```js
SendDeliverySchema = new Schema({
  ...
  user_from: {
    type: Schema.ObjectId,
    ref: 'UserModel'
  },
  ...
});
```
populate的用法：
```js
Send.findOne({ status:2 }).populate('user_from').exec(function (err,doc){
  console.log(doc.user_from.username);
});
```
只取出部分字段：
```js
.populate('user', 'name') // only return the Persons name
```
1.populate关联多个表，可以连续使用多个populate
2.populate返回一个promise对象
```js
.populate('user_from').populate('express')
.then(function (sendReqs){
})
```
####4.了解statics方法和methods的区别
#####statics
```js
UserSchema.statics.find_by_openid = function(openid, cb) {
  return this.findOne({
    openid: openid
  }, cb);
};
```
调用：
```js
User.find_by_openid(openid, cb)
```
#####methods
```js
UserSchema.methods.is_exist = function(cb) {
  var query;
  query = {
    username: this.username,
    password: this.password
  };
  return this.model('UserModel').findOne(query, cb);
};
```
调用：
```
var user = new User({});
user.is_exist(cb)
```
####5.了解pre和post的差别
```js
UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
          user.password = hash;
          next();
        });
    });
});
```
pre 方法表示在执行操作之前，先执行回调函数
post方法表示在执行操作之后，再执行回调函数
####6.了解mvc里m的作用，以及什么样的代码应该放到模型里
M = mongodb
![Alt text](http://nodeonly.com/nodesang/images/mvc.png)
####7.了解索引优化
索引或者复合索引能让搜索更加高效，默认索引就是主键索引ObjectId，属性名为_id， 索引会作为一个专题来讲解
```js
ContactSchema = new Schema({
    ...
    owner: {
      type: Schema.ObjectId,
      required: true,
      index: true
    }
});
```
也可以这样的
```
ContactSchema.ensureIndexes(owner);
```
[参考](https://libraries.io/github/mwn-notes/mongoose)
***
###promise/a+规范，合理规避回调陷阱
####1.了解node的异步
优点：高效
异步虽然能够极大的提升node.js处理请求的性能，但是同时也让错误处理变得复杂。
即一切都是异步的同步是奢求，要查Api，
####2.了解异步基本场景，如何处理事务，使用async的parallel和waterfall处理异步
而当异步处理遇到for循环的话，就有麻烦；采用递归调用取代for，然而递归深的话，代码可读性差。
首先看waterfall，顾名思义，像流水线一样有序执行：
```js
async.waterfall([
  function (callback){
    var a=5;
    console.log('OK1'); 
    setTimeout(function (){callback(null,a*2)},1000);},
  function(data,callback){
    console.log('OK2');
    setTimeout(function(){callback(null,data+7,data)},2000);},
  function(result1,result2,callback){
    console.log('OK3');
    setTimeout(function (){callback(null,result1-9,result2)},3000);}
],function(err,kk,jj){console.log(kk);console.log(jj);})，所以第一个函数的callback就是他后面的那个函数，
//自然数组最后一个函数的callback是finalFunction，对应递归写法的callback。
//除了这点还有一点需要注意，callback的第一个参数表示错误的信息，即使没错误，也要填上null，
//后面才是你想要传递的数据，而且除了finalFunction都不能显示接收错误信息，虽然callback有显式传递，waterfall的运行机制是只要数组中的任意一个函数出错立马跳到finalFunction，finalFunction会接收错误信息
//所以第一个函数的callback就是他后面的那个函数，自然数组最后一个函数的callback是finalFunction，对应递归写法的callback。
```
async.parallel
```js
async.auto({
result1:function(callback){setTimeout(function(){
  callback(null,'functionResult1')},2000)},
result2:function(callback){setTimeout(function(){
  callback(null,'functionResult2')},1000)},//result1与result2是独立的，result3依赖于result1和result2
result3:['result1','result2',function(callback,replyData){  
  setTimeout(function(){callback(null,replyData.result1+replyData.result2);},1000)}]
  //注意result3的执行函数的参数输入与参数引用
},function(err,data){console.log(data)});
```
输出
```js
{
result2:functionResult2,
result1:functionResult1,
result3:functionResult1functionResult2
}
//结果是一个对象，和输入是函数组成的对象一样，对象元素出现的先后顺序决定于哪个结果先得到，当然依赖于另一个函数的计算结果的函数的结果当然就在其所依赖的后面。
```
####3.了解如何重构流程，以及代码的可读性
在你开始动手重构代码之前，认真对待单元测试，那样你的项目的稳定性将得到改善，而你甚至还没有开始考虑可扩展性。单元测试带来的另一个好处是你不再需要无时无刻担心你的改动会无意中破坏原有功能。  
Rebecca Murphey 写了一篇很棒的文章关于如何为现有代码写[单元测试](https://rmurphey.com/blog/2014/07/13/unit-tests)。  
为你的重构工作开一个新的分支，千万别总是在主线 (master) 上改。在 GitHub 
上有一份[有趣的指导](https://guides.github.com/introduction/flow/)，是关于如何使用他们的版本控制流程的。
***
###代码调试
####1.node-inspector
1.1 全局安装`node-inspector`
```js
npm install -g node-inspector
```
1.2 测试是否安装成功？
输入`node-inspector`,若出现版本即可。
1.3 进行debug调试
安装完成之后，通常可以直接这样启动在后台：
```js
node-inspector &
```
可用
```js
node —debug[=port] filename //指定端口(默认5858)
node —debug-brk[=port] filename //强调断点在第一行
```
####2.webstorm内置调试方法
新建debug配置项->选择浏览器Chrome->打断点->运行Debug模式
***

###消息处理
####1.socket-io
Socket.io的出现就是为了完善WebSocket。  
Socket.IO实现了实时、双向、基于事件的通讯机制,它解决了实时的通信问题，并统一了服务端与客户端的编程方式。  
在使用Node的http模块创建服务器同时还要Express应用，因为这个服务器对象需要同时充当Express服务和Socket.io服务。  
```js
//服务端
var app = require('express')(); //Express服务
var server = require('http').Server(app); //原生Http服务
var io = require('socket.io')(server); //Socket.io服务
io.on('connection', function(socket){
    /* 具体操作 */
});
server.listen(3000);
```
```css
//客户端
<script src="/lib/socket.io/socket.io.js"></script>
<script>
   var socket = io();
   socket.on('connect', function() {
           /* 具体操作 */
   });
</script>
```
####2.复杂消息系统设计
配置Socket.io服务器  
 首先安装安装Socket.IO、connect-mongo、cookie-parser依赖我们先将依赖报引入，然后定义服务器对象。 
配置Socket.io Session  
  为了是Socket.io seesion 和Express session一起工作，我们必须让他们信息共享。`Express Session`  
  默认是存储在内存，我们需要把它存在mongoDB以便Socket.io能获取。 
配置chat控制器 
  回调函数来控制数据格式的建立和分发。    
[官网](http://socket.io/docs/#sending-and-getting-data-(acknowledgements))
####3.状态逻辑
客户端socket.on()监听的事件：
connect：连接成功  
connecting：正在连接  
disconnect：断开连接  
connect_failed：连接失败  
error：错误发生，并且无法被其他事件类型所处理  
message：同服务器端message事件  
anything：同服务器端anything事件  
reconnect_failed：重连失败  
reconnect：成功重连  
reconnecting：正在重连  
当第一次连接时，事件触发顺序为：connecting->connect；当失去连接时，事件触发顺序为：disconnect->reconnecting（可能进行多次）->connecting->reconnect->connect。  
[参考](http://www.cnblogs.com/edwardstudy/p/4358202.html)
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
##2016/8/3
###头像上传及显示
###思路
模仿mooc及news图片上传打码，user添加userThumb属性
###遇到的问题
####1. uploadimg
一会儿可以上传，一会儿又不能，最后发现，只有在用户登录过才能上传上去，于是乎经过反复思考发现，
这个与`authority`有关系，重新刷新之后的`user`没有`authorized`，因此不能上传，没有权限。因此做出调整：
取消对于`index`的授权，将`uploadimg`放在`index`的路由下面。但是`admin`的权限并没有取消（处于实际考虑）
####2. 图片显示
通过调用 `{{entries.author.userThumb}}`并不能显示，最后通过`initBlog`中的`imgUrl`获取`cookie`中的
`userThumb`，然后`class`中`uig`绑定`imgUrl`中`userThumb`中的`src`，然后调用。
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
###flex教程总结
####语法
ps:第一个为默认
#####1.容器的属性
* 1.1 flex-direction
```css
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```
属性决定主轴的方向（即项目的排列方向）。默认`row`主轴方向，及→

* 1.2 flex-wrap  
```css
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```
`flex-wrap`属性定义，如果一条轴线排不下，如何换行。
>`flex-flow`属性是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`。  

*  1.3 justify-content  
```css
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```  
![](https://css-tricks.com/wp-content/uploads/2013/04/justify-content.svg)

*  1.4 align-items  
```css
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```
![](https://css-tricks.com/wp-content/uploads/2014/05/align-items.svg)

*  1.5 align-content  

```css
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```
属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。  
![](https://css-tricks.com/wp-content/uploads/2013/04/align-content.svg)  
#####2.项目属性
* 2.1 order   
order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0.  
```css
.item {
  order: <integer>;
}
```
* 2.2 flex-grow  
`flex-grow`属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
如果一个项目的`flex-grow`属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。    
* 2.3 flex-shrink  
与`flex-grow`相反，及等比缩小   
* 2.4 flex-basis    
定义了在分配多余空间之前，项目占据的主轴空间（`main size`）。浏览器根据这个属性，计算主轴是否有多余空间。  
```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```
* 2.4 flex  
该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。
```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```
* 2.5 align-self  
该属性可能取6个值，除了auto，其他都与align-items属性完全一致。  
```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```
>tip:对于`margin:10px;`的`item`的`width`设为1/3会出现`bug`，可做以下改动.
```css
width:calc(33.333333%-20px) 
```
