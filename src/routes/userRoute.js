const router = require("express").Router()
const users = require("../models/users")
const bcrypt = require("bcrypt")
const {body, validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")

router.post("/register",body("email").isEmail(),body("password").isLength({min:8}), async(req,res)=>{
    try{
        let {email, password, confirmPassword} = req.body;
        if(password!==confirmPassword){
            return res.status(403).json({
                status:"Failed",
                message:"Password and confirm Password not matched"
            })
        }
        let response = await users.find({email});
        if(!response){
            return res.status(403).json({
                status:"Failed",
                message:"user already exists"
            })
        }else{
        bcrypt.hash(password, 10 , async (err, hash)=>{
            if(err){
                return res.status(403).json({
                    status:"Failed",
                    message:"Pls signUp again",
                    err
                })
            }
            try{
                let response = await users.create({email:email,password:hash})
                    res.status(200).json({
                    status:"Success",
                    message:"User Created Successfully",
                    response
                })
            }catch(e){
                res.status(403).json({
                    status:"Failed",
                    message:e.message
                })
            }
            
                
        })
        
        
    }

    }catch(e){
        res.status(403).json({
            status:"Failed",
            message:e.message
        })
    }
})

router.post("/login",body("email").isEmail(),body("password").isLength({min:8}), async(req,res)=>{
    try{
        let {email, password} = req.body
        let response = await users.findOne({email});
        if(!response){
            return res.status(403).json({
                status:"Failed",
                message:"User is not registered"
            })
        }else{
            bcrypt.compare(password, response.password, (err, result)=>{
                console.log(response._id)
                if(!err){
                    let token = jwt.sign({
                        exp: Math.floor(Date.now()/1000)+(60*60),
                        data: response._id
                    }, process.env.SECRET)
                    console.log(token)
                    res.status(403).json({
                        status:"Success",
                        message:"User Logged In Successfully",
                        token
                    })

                }else{
                    res.status(403).json({
                        status:"Failed",
                        message:"Password is wrong"
                    })
                }
            })
        }


    }catch(e){
        res.status(403).json({
            status:"Failed",
            message:e.message
        })
    }
})

router.get("/", async(req,res)=>{
    try{
        let result = await users.find()


    }catch(e){
        res.status(403).json({
            status:"Failed",
            message:e.message
        })
    }
})

module.exports = router