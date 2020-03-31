const mongoose = require('mongoose');
// Schema描述关系模式
const Schema = mongoose.Schema;
//实例化Schema
const IdeaSchema = new Schema({
    title:{
        type:String,
        required:true // 是否必填：是
    },
    details:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
// 将实例化的IdeaSchema放入模型中
mongoose.model('ideas',IdeaSchema);
