
import User from '../models/userModels.js';

export const  getUserBySearch = async (req,res,next)=>{
    try{
        const search= req.query.search;
        const userId = req.user._id;
        const user = await User.find({ 
            $and :[
                {
                    $or:[
                        {username: { $regex: search, $options: 'i' } },
                        {fullname: { $regex: search, $options: 'i' }}

                   ]
                },{ _id: { $ne: userId } }
            ]
         }).select('_id username fullname profilePic');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
       
        res.status(200).json({success : true , message : "done", user : user});
    }catch(err){
        res.status(500).json({success : false, message : err.message});
    }
}