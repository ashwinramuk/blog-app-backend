const express = require("express");
const cors = require("cors")
const jwt = require("jsonwebtoken")
const userRoute = require("./routes/userRoute")
const postsRoute = require("./routes/postsRoute")
const app = express();

app.use(cors())
//middlewares
app.use(express.json());
app.use(express.urlencoded())

const tokenVerification=(req,res,next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization
        if(token){
            jwt.verify(token, process.env.SECRET,(err, decoded)=>{
                if(err){
                    return res.status(400).json({
                        status:"Failed",
                        message:"Invalid/expired token",
                        err
                    })
                }else{
                    req.userID = decoded.data;
                    console.log(req.userID)
                    next();
                }
            })
        }else{
            return res.status(400).json({
                status:"Failed",
                message:"Token is not provided"
            })
        }
        
    }else{
        return res.status(400).json({
            status:"Failed",
            message:"Unauthorised Access"
        })
    }
}

app.use("/v1/api/users", userRoute)
app.use("/v1/api/posts",tokenVerification, postsRoute)


module.exports = app;