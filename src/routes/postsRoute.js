const router = require("express").Router()
const posts = require("../models/posts")
const {body, validationResult} = require("express-validator")
const multer = require("multer")
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

require("dotenv").config()
const upload = multer()
cloudinary.config({
    // cloudinary_url: process.env.CLOUDINARY_URL
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
router.post("/", upload.single("image"), (req,res,next)=>{
    let streamUpload = (req) =>{
        return new Promise((resolve,reject)=>{
            let stream = cloudinary.uploader.upload_stream(
                (error,result)=>{
                    if(result) {
                        resolve(result);
                    }else{
                        reject(error);
                    }
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    async function upload(req){
        try{
            let result = await streamUpload(req);
            console.log("result",result);
            req.body.imgURL=result.url;
            next();
        }catch(e){
            console.log("error",e)
        }
        
    }
    upload(req);
},async(req,res)=>{

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
        res.status(200).json({
            status:"Success",
            message:"user's posts retrieved Successfully",
            result 
        })    
    }catch(e){
        res.status(403).json({
            status:"Failed",
            message:e.message
        })
    }
})

module.exports = router