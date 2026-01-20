dotenv.config({path : "./.env"});
import dotenv from "dotenv";
import express from "express";
import dbConnect from "./DB/DBConnect.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import authUserRoutes from "./routes/authUser.js";
import cors from "cors";
import conversationRoutes from "./routes/conversationRoutes.js";



const app = express();

app.get('/' , (req,res)=>{
    res.send("hellow");
})
app.use(express.json());
//app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use(cookieParser());

 app.use('/api/auth', authRoutes);
 app.use('/api/messages',messageRoutes);
 app.use('/api/user',authUserRoutes);
 app.use('/api/conversations', conversationRoutes);
app.listen('8080',()=>{
    dbConnect();
    console.log("working");
})