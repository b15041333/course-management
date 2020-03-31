const mongoose = require('mongoose');
// Schema描述关系模式
const Schema = mongoose.Schema;
//实例化Schema
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
// 将实例化的IdeaSchema放入模型中
mongoose.model('users',UserSchema);
