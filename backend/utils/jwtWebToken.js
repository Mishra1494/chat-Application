import jwt from 'jsonwebtoken';
// import dotenv from "dotenv";
// dotenv.config({path : "./.env"});

const generateToken  =  (userId,res) =>{
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({id : userId},process.env.JWT_SECRET,{expiresIn : '7d'});
    res.cookie("token",token,{
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
        sameSite : "strict",
        secure : process.env.NODE_ENV === "production"
    });
    return token;
}

export default generateToken;