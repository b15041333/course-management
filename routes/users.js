// 用户登录/注册
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require("passport");

// body-parser的中间件
// create routerlication/json parser
var jsonParser = bodyParser.json();
// create routerlication/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended:false})

// 加载model
require('../models/User');
const User = mongoose.model("users");

router.get("/users/login",(req,res) => {
    res.render('users/login');// 与login.handlebars关联
})

router.post("/users/login",urlencodedParser,(req,res,next) => {
    // 使用passport进行登录验证
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})

router.get("/users/register",(req,res) => {
    res.render("users/register");
})

router.post("/users/register",urlencodedParser,(req,res) => {
    let errors = [];
     if(req.body.password != req.body.password2){
         errors.push({
             text:"两次输入的密码不一致！"
         })
     }
     if(req.body.password.length < 8){
         errors.push({
            text:"密码的长度必须在8位或8位以上" 
         })
     }

     if(errors.length > 0){
         // 有错误
         res.render('users/register',{
             errors:errors,
             name:req.body.name,
             email:req.body.email,
             password:req.body.password,
             password2:req.body.password2
         })
     }else{
         // 将数据存储到数据库
         User.findOne({email:req.body.email})
            .then(user => {
                if(user){
                    req.flash("error_msg","邮箱已被注册，请更换邮箱！");
                    res.redirect("/users/register");
                }else{
                    const newUser = new User({
                        name:req.body.name,
                        email:req.body.email,
                        password:req.body.password
                    });
                    // 对密码进行加密
                    bcrypt.genSalt(10,(err,salt) => {
                        bcrypt.hash(newUser.password,salt,(err,hash) => {
                            if(err) throw err;
                            newUser.password = hash;// hash是加密后的密码
                                
                            // 因为是回调函数，异步进行，所以如果把下面这部分放在bcrypt.genSalt之外，可能会先执行更新,
                            //  更新结束后才加密完成，导致更新到数据库中的是加密前的。
                            //  所以这部分代码务必紧跟在将hash赋值给newUser.password这步操作之后。
                            newUser.save()
                            .then(user => {
                                console.log(newUser);
                                req.flash("success_msg","账号注册成功");
                                res.redirect("/users/login");
                            }).catch(err => {
                                req.flash("error_msg","账号注册失败！");
                                res.redirect("/users/register");
                            })
                            });
                    });
            }
        })
    }
});

router.get("/users/logout",(req,res) => {
    req.logout();
    req.flash("success_msg","退出登录成功！");
    res.redirect("/users/login");
})

module.exports = router;