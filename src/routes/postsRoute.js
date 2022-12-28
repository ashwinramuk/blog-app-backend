const router = require("express").Router()
const posts = require("../models/posts")
const {body, validationResult} = require("express-validator")

router.post("/", async(req,res)=>{
    try{
        let result = await posts.create({...req.body,userID:req.userID})
            res.status(200).json({
                status:"Success",
                message:"post created Successfully",
                result
            })      

    }catch(e){
        res.status(403).json({
            status:"Failed",
            message:e.message
        })
    }
})
router.get("/", async(req,res)=>{
    try{
        let result = await posts.find({userID:req.userID})
        if(result.length){
            res.status(200).json({
                status:"Success",
                message:"user's posts retrieved Successfully",
                result
            })
        }       

    }catch(e){
        res.status(403).json({
            status:"Failed",
            message:e.message
        })
    }
})

module.exports = router