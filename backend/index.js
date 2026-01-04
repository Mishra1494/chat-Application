dotenv.config({path : "./.env"});
import dotenv from "dotenv";
import express from "express";
import dbConnect from "./DB/DBConnect.js";

const app = express();

app.get('/' , (req,res)=>{
    res.send("hellow");
})
app.listen('8080',()=>{
    dbConnect();
    console.log("working");
})