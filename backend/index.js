dotenv.config({path : "./.env"});
import dotenv from "dotenv";
import express from "express";
import dbConnect from "./DB/DBConnect.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

app.get('/' , (req,res)=>{
    res.send("hellow");
})
app.use(express.json());
//app.use(cookieParser());

 app.use('/api/auth', authRoutes);
 app.use('/api/messages',messageRoutes);
app.listen('8080',()=>{
    dbConnect();
    console.log("working");
})