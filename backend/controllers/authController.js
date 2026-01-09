import userModel from "../models/userModels.js";
import checkUserExists from "../utils/checkUser.js";
import hashPassword from "../utils/hashPassWord.js";
import jwtWebToken from "../utils/jwtWebToken.js";
import bcrypt from 'bcryptjs';





export const register =async (req,res)=>{
    try{
        const {fullname,userName,email,gender,password,profilePic} = req.body;
        const user = await userModel.findOne({email,userName});
        if(checkUserExists(userName,email).exists){
           return res.status(400).json({success : false, message : `${checkUserExists(userName,email).field}` + "alreay exists"});
        }
        const hashedPassword = await hashPassword(password);
        const boyProfilePic = "https://api.dicebear.com/7.x/avataaars/png?seed=male";
        const girlProfilePic = "https://api.dicebear.com/7.x/avataaars/png?seed=female";
        const otherProfilePic = "https://api.dicebear.com/7.x/avataaars/png?seed=others";
        const defaultProfilePic = gender === "male" ? boyProfilePic : gender === "female" ? girlProfilePic : otherProfilePic;
        
        const newUser = new userModel({
            fullname,
            userName,
            email,
            gender,
            password: hashedPassword,
            profilePic: profilePic || defaultProfilePic
        });
        if(newUser){
            await newUser.save();
            jwtWebToken(newUser._id , res);
        }else{
            return res.status(500).json({success : false, message : "unable to create user"});
        }
        
        res.status(201).json({success : true , message : "user registered successfully", newUser});
    }catch(error){
        res.status(500).json({success:false, message : error.message});
    }
}






export const login = async (req,res)=>{
    try{
        const {email , userName, password} = req.body;
        if(!email && !userName){
            return res.status(400).json({success : false,message : "email or userName is required"});
        }
        const user = await userModel.findOne({$or :[email ? {email} : null, userName ? {userName} : null].filter(Boolean)});
        if(!user){
            res.status(404).json({success : false, message : "user not found"});
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({success : false, message : "invalid credentials"});
        }

        const generateToken = jwtWebToken(user._id,res);
        res.status(200).json({success : true,token: generateToken, message : "login successful",user});
    }catch(error){
        res.status(500).json({success:false, message : error.message});
    }
}



export const logout = (req,res)=>{
    res.clearCookie("token",{
        httpOnly : true, 
        sameSite : "strict",
        secure : process.env.NODE_ENV !== "production"
    });
    res.status(200).json({success : true, message : "logout successful"});
}