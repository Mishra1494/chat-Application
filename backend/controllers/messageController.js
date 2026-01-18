import Message from "../models/messageSchema.js";
import Conversation from "../models/conversationModels.js";


export const sendMessage = async(req,res)=>{
    try{
        const { message} = req.body;
        const { recieverId } = req.params;
        console.log(req.user);
        const senderId = req.user._id;
        let Chats = await Conversation.findOne({
            participants : { $all : [senderId , recieverId]}
        })

        if(!Chats){
            Chats =  await  Conversation.create({
                participants : [senderId,recieverId],
            })
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message,
            conversationId : Chats._id,
        })

        if(newMessage){
            Chats.message.push(newMessage._id);
        }


        // SOCKET.IO  function
        await Promise.all([Chats.save(),newMessage.save()]);

        res.status(201).json({success : true, message : "message sent successfully", newMessage});

    }catch(error){
        res.status(500).json({success:false, message : error.message});
    }
};


export const getMessages = async(req,res)=>{
    try{
         const { recieverId } = req.params;
        console.log(req.user);
        const senderId = req.user._id;
        let Chats = await Conversation.findOne({
            participants : { $all : [senderId , recieverId]}
        }).populate("message");
        if(!Chats){
            res.status(200).json({success: true, messages:[]});
        }
        const messages = Chats.message;

        res.status(200).json({success : true, messages});
    }catch(error){
        res.status(500).json({success:false, message : error.message});
    }
}