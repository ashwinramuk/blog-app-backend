const mongoose = require("mongoose")
const server = require("./src/app.js")
const dotenv = require("dotenv")
dotenv.config();

mongoose.connect(process.env.MONGO_URI, ()=>{console.log("DataBase is connected Successfully")})

server.listen(process.env.PORT||5000, ()=>{console.log("server is running successfully")})

