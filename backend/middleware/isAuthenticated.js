import jwt from "jsonwebtoken";
import user from "../models/userModels.js";

const isAuthenticated = async(req,res,next)=>{
    try{
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer "," ");
        if(!token){
            return res.status(500).json({success : false , message : "Unauthorized user " });
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.status(500,json({success :  false , message : "Unauthorized user - Invalid token"}));
        }
        const User = await user.findById(decode.id).select("-password");
        if(!User){
            return  res.status(500).json({success : false, message : "Unauthorized user - User not found"});
        }
                req.user = User;
                next();
    }catch(error){
        res.status(500).json({success:false, message : error.message});
    }
}


export default isAuthenticated;