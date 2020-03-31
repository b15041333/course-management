const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");

const app = express();

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

require("./config/passport")(passport);// passport是引此方法时传入的参数，即将passpost传给我自己的passport.js

// 连接mongoose
mongoose.connect("mongodb://localhost/node-app",{useNewUrlParser:true,useUnifiedTopology:true})
.then(() => {
    console.log("MongoDB connected.");
})
.catch(err => {
    console.log(err);
})
// 引入模型（Models）
require('./models/Idea');
const Idea = mongoose.model('ideas');

// handlebars中间件
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
// 使用handlebars作为模板引擎
app.set('view engine','handlebars');

// body-parser的中间件
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended:false})

// 使用静态文件
app.use(express.static(path.join(__dirname,'public')));

// method-override的中间件
app.use(methodOverride('_method'));

// session & flash 的中间件
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
}))

// passport相关中间件
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// 配置全局变量
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;// 用户登录后不再显示“登录”与“注册”两个选项
    next();// 配置下一个中间件
})

// 配置路由
app.get("/",(req,res)=>{
    // 若请求了根路径
    const title = "欢迎使用课程管理平台";
    res.render("index",{
        title:title
    });
})

app.get("/about",(req,res)=>{
    // 注意，配置路由之后需要重启app.js才能生效，除非使用nodemon来启动app.js，它可以监听变化
    // 若请求了'/about'路径
    res.render("about");
})

app.use("/",ideas);// 使用ideas.js中配置的路由
app.use("/",users);// 使用users.js中配置的路由

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server started on ${port}`);
})