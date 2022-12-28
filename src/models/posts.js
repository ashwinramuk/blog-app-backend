const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const postSchema = new Schema({
    title:{type:String, required:true},
    content:{type:String, required:true},
    imgURL:{type:String, required:true},
    author:{type:String},
    dateCreated:{type:Date, default:Date.now},
    userID:{type:ObjectId ,ref:"users"}
})

const posts = mongoose.model("posts", postSchema)

module.exports = posts;