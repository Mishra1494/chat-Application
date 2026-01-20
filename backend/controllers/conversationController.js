import mongoose from "mongoose";
import Message from "../models/messageSchema.js";

export const getConversation = async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.user._id);
    const otherUserId = new mongoose.Types.ObjectId(req.params.userId);

    console.log("Fetching messages between:", myId, "and", otherUserId);

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: otherUserId },
        { senderId: otherUserId, recieverId: myId }
      ]
    }).sort({ createdAt: 1 });
    console.log("Retrieved messages:", messages);

    res.status(200).json({
      success: true,
      messages
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
