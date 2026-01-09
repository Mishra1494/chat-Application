import userModel from "../models/userModels.js";
import checkUserExists from "../utils/checkUser.js";
import hashPassword from "../utils/hashPassWord.js";
import jwtWebToken from "../utils/jwtWebToken.js";

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