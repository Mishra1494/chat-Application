dotenv.config({path : "./.env"});
import dotenv from "dotenv";
import express from "express";
import dbConnect from "./DB/DBConnect.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.get('/' , (req,res)=>{
    res.send("hellow");
})
app.use(express.json());
console.log("authRoutes =", authRoutes);
console.log("type =", typeof authRoutes);
 app.use('/api/auth', authRoutes);
app.listen('8080',()=>{
    dbConnect();
    console.log("working");
})