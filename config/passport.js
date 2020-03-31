const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 加载model
const User = mongoose.model("users");

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        {usernameField:"email"},
        (email,password,done) => {
            // 查询数据库
            User.findOne({email:email})
            .then(user => {
                if(!user){
                    return done(null,false,{message:"用户不存在"});
                }

                // 用户存在，进行密码验证
                bcrypt.compare(password,user.password,(err,isMatch) => {
                    if(err){
                        throw err;
                    }
                    if(isMatch){
                        return done(null,user);
                    }else{
                        return done(null,false,{message:"密码错误"});
                    }
                })
            })
        }
    ));

    // 序列化与反序列化，其作用是使得登录状态持久化
    passport.serializeUser((user,done) => {
        done(null,user.id);
    })

    passport.deserializeUser((id,done) => {
        User.findById(id,(err,user) => {
            done(err,user);
        })
    })
}