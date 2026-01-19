
import User from '../models/userModels.js';
import Conversation from '../models/conversationModels.js';

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


// export const getCurrentUser = async (req, res, next) => {

//     try{
//         const userId = req.user._id;
//         const chatters = await conversation.find({
//             participants:userId
//     }).sort({updatedAt : -1});
//     if(!chatters || chatters.length === 0){
//         return res.status(404).json({message : "no chats found"});
//     }
//     const participantsID = chatters.reduce((ids,conversation)=>{
//         const otherParticipant = conversation.participants.fillter(id => id.toString() !== userId.toString());
//         return [...ids,...otherParticipant];
//     })

//     const otherParticipant = participantsID.filter(id => id.toString() !== userId.toString());

//     const user = await User.find({_id : {$in : otherParticipant}}).select('-password').select('-email');

//     const users = otherParticipant.map(id =>user.find(user => user._id.toString() === id.toString()));

//     res.status(200).json({success : true , message : "done", users : users});
//     }catch(err){
//         res.status(500).json({success : false, message : err.message});
//     }
// }
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    }).sort({ updatedAt: -1 });

    if (!conversations || conversations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "no chats found"
      });
    }

    // Collect all other participant IDs
    const participantIds = conversations.reduce((ids, convo) => {
      const others = convo.participants.filter(
        id => id.toString() !== userId.toString()
      );
      return [...ids, ...others];
    }, []);

    // Remove duplicates
    const uniqueParticipantIds = [
      ...new Set(participantIds.map(id => id.toString()))
    ];

    const users = await User.find({
      _id: { $in: uniqueParticipantIds }
    }).select('-password -email');

    res.status(200).json({
      success: true,
      message: "done",
      users
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};