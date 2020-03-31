const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const router = express.Router();
const {ensureAuthenticated} = require("../helpers/auth");

// 引入模型
require("../models/Idea")
const Idea = mongoose.model('ideas');

// body-parser的中间件
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended:false})

router.get("/ideas",(req,res) => {
    // 这里有个bug，但是我参考stackoverflow解决掉了
    // https://stackoverflow.com/questions/59690923/handlebars-access-has-been-denied-to-resolve-the-property-from-because-it-is
    Idea.find({user:req.user.id}).lean()// 获取所有数据
        .sort({date:"desc"})// 对获取到的结果按照date降序排序
        .then(ideas => {// 参数ideas是从数据库拿到的内容
        res.render("ideas/index",{// 跳转到ideas文件夹下的index.handlebars中
            ideas:ideas // 将从数据库中获得的内容ideas传给index.handlebars中的ideas变量
        });
    })
})

router.get("/ideas/add",ensureAuthenticated,(req,res)=>{
    res.render("ideas/add");
})

// 编辑
router.get("/ideas/edit/:id",ensureAuthenticated,(req,res)=>{// 传入路由参数id
    Idea.findOne({
        _id:req.params.id,// 获取url中传入的id
    })
    .lean()
    .then( (idea) => {
        if(idea.user != req.user.id){
           // 不是在相同的用户下访问
           req.flash("error_msg","非法操作！");
           res.redirect("/ideas");
        }else{
            res.render("ideas/edit",{
                idea:idea
            })
        }
    })
})

router.post("/ideas",urlencodedParser,(req,res)=>{
    let errors = [];

    if(!req.body.title){
        errors.push({text:"请输入标题！"});
    }

    if(!req.body.details){
        errors.push({text:"请输入详情！"});
    }

    if(errors.length > 0){
        res.render("ideas/add",{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
    }else{
        // 校验无错误：将数据存储起来，并且跳转到需要跳转的界面
        const newUser = {
           title:req.body.title,
           details:req.body.details,
           // userId 
           user:req.user.id,
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash("success_msg","数据添加成功！")
            res.redirect('/ideas');
        })
    } 
})

// PUT方法提交课程修改的路由
router.put("/ideas/:id",urlencodedParser,(req,res) => {
    Idea.findOne({
        _id:req.params.id
    })
    // 这里需要获得idea这个对象，所以不能用.lean()将其转为json
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                req.flash("success_msg","数据编辑成功！");
                res.redirect("/ideas");
            })
    })
})

// 实现已提交课程的删除
router.delete("/ideas/:id",ensureAuthenticated,(req,res) => {
    Idea.remove({
        _id:req.params.id
    })
    .then(() => {
        req.flash("success_msg","数据删除成功！")
        res.redirect("/ideas");
    })
})

module.exports = router;